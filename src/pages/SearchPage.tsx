import React, { useState, useEffect } from "react";
import axios from "axios";
import DogCard from "../components/DogCard";
import BreedFilter from "../components/BreedFilter";
import Pagination from "../components/Pagination";
import FavoriteList from "../components/FavoriteList";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
  state?: string;
}

const SearchPage: React.FC<{ favorites: string[], setFavorites: React.Dispatch<React.SetStateAction<string[]>> }> = ({ favorites, setFavorites }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("breed:asc");
  const [pagination, setPagination] = useState<{ next: string | null; prev: string | null }>({
    next: null,
    prev: null,
  });
  
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/dogs/breeds`, { withCredentials: true })
      .then((response) => {
        setBreeds(["all", ...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching breeds:", error);
      });
  }, []);

  const fetchDogs = async (query = "") => {
    try {
      setLoading(true); 
      const breedQuery = selectedBreed !== "all" ? `breeds=${selectedBreed}&` : "";
      const apiSortField = sortOrder.startsWith("state") ? "breed:asc" : sortOrder;
      
      const response = await axios.get(
        `${API_BASE_URL}/dogs/search?${breedQuery}sort=${apiSortField}${query ? `&${query}` : ""}`,
        { withCredentials: true }
      );

      if (response.data && response.data.resultIds) {
        const dogDetails = await axios.post(`${API_BASE_URL}/dogs`, response.data.resultIds, {
          withCredentials: true,
        });

        const validDogs = (dogDetails.data || []).filter((dog: any): dog is Dog => dog !== null && dog.zip_code);

        const zipCodes = [...new Set(validDogs.map((dog: Dog) => dog.zip_code))];

        const locationResponse = await axios.post(`${API_BASE_URL}/locations`, zipCodes, {
          withCredentials: true,
        });

        const zipStateMap: { [key: string]: string } = {};
        locationResponse.data.forEach((location: { zip_code: string; state: string }) => {
          if (location && location.zip_code && location.state) {
            zipStateMap[location.zip_code] = location.state;
          } else {
            console.warn("Skipping null location for zip:", location);
          }
        });

        let updatedDogs = validDogs.map((dog: Dog) => {
          const state = zipStateMap[dog.zip_code] || "Unknown";
          if (state === "Unknown") {
            console.warn(`Missing state for dog with zip: ${dog.zip_code}`);
          }
          return { ...dog, state };
        });

        if (sortOrder.startsWith("state")) {
          updatedDogs.sort((a: Dog, b: Dog) => {
            if (!a.state) return 1;
            if (!b.state) return -1;
            return sortOrder === "state:asc"
              ? a.state.localeCompare(b.state)
              : b.state.localeCompare(a.state);
          });
        }

        setDogs(updatedDogs);
        setPagination({ next: response.data.next, prev: response.data.prev });
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortOrder]);

  const addFavorite = (dogId: string) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(dogId)
        ? prevFavorites.filter((id) => id !== dogId)
        : [...prevFavorites, dogId];
  
      return updatedFavorites;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Dogs</h1>
      <div className="flex items-center gap-4">
        <BreedFilter breeds={breeds} selectedBreed={selectedBreed} onSelectBreed={setSelectedBreed} />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="breed:asc">Breed (A-Z)</option>
          <option value="breed:desc">Breed (Z-A)</option>
          <option value="name:asc">Name (A-Z)</option>
          <option value="name:desc">Name (Z-A)</option>
          <option value="age:asc">Age (Youngest First)</option>
          <option value="age:desc">Age (Oldest First)</option>
          <option value="state:asc">State (A-Z)</option>
          <option value="state:desc">State (Z-A)</option>
        </select>
        <button
          onClick={() => fetchDogs()}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading} 
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Show loading spinner if loading */}
      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="ml-3 text-blue-500 font-semibold">Fetching dogs...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {!loading && dogs.length > 0 ? (
          dogs.map((dog) => <DogCard key={dog.id} dog={dog} onFavorite={addFavorite} isFavorited={favorites.includes(dog.id)} />)
        ) : (
          !loading && <p className="text-gray-600 text-center w-full">No dogs found. Try selecting different criteria and searching again.</p>
        )}
      </div>

      <Pagination
        onNext={() => fetchDogs(pagination.next || "")}
        onPrev={() => fetchDogs(pagination.prev || "")}
        hasNext={!!pagination.next}
        hasPrev={!!pagination.prev}
      />

      <FavoriteList favorites={favorites} />
    </div>
  );
};

export default SearchPage;