import React, { useState, useEffect } from "react";
import axios from "axios";
import DogCard from "../components/DogCard";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  breed: string;
  zip_code: string;
  state?: string;
}

const FavoritesPage: React.FC<{ favorites: string[]; setFavorites: (favorites: string[]) => void }> = ({ favorites, setFavorites }) => {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (favorites.length > 0) {
      axios
        .post(`${API_BASE_URL}/dogs`, favorites, { withCredentials: true })
        .then(async (response) => {
          const dogs = response.data;
          const zipCodes = [...new Set(dogs.map((dog: Dog) => dog.zip_code))];
          
          if (zipCodes.length > 0) {
            const locationResponse = await axios.post(`${API_BASE_URL}/locations`, zipCodes, {
              withCredentials: true,
            });
            
            const zipStateMap: { [key: string]: string } = {};
            locationResponse.data.forEach((location: { zip_code: string; state: string }) => {
              zipStateMap[location.zip_code] = location.state;
            });
            
            const updatedDogs = dogs.map((dog: Dog) => ({
              ...dog,
              state: zipStateMap[dog.zip_code] || "Unknown",
            }));
            
            setFavoriteDogs(updatedDogs);
          } else {
            setFavoriteDogs(dogs);
          }
        })
        .catch((error) => console.error("Error fetching favorite dogs:", error));
    } else {
      setFavoriteDogs([]);
    }
  }, [favorites]);

  const handleMatch = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/dogs/match`, favorites, { withCredentials: true });
      const matchedDogId = response.data.match;
      const matchedDog = favoriteDogs.find((dog) => dog.id === matchedDogId) || null;
      setMatch(matchedDog);
      setShowModal(true);
    } catch (error) {
      console.error("Error finding match:", error);
    }
  };

  const removeFavorite = (dogId: string) => {
    setFavorites(favorites.filter((id) => id !== dogId));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Favorite Dogs</h1>
        <button
          onClick={() => navigate("/search")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg mb-4 font-semibold transition-all"
        >
          Back to Search
        </button>

        {favoriteDogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteDogs.map((dog) => (
              <div key={dog.id} className="relative bg-gray-50 shadow-md rounded-lg p-4">
                <DogCard dog={dog} onFavorite={() => {}} isFavorited={true} />
                
                <button
                  onClick={() => removeFavorite(dog.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition-transform transform hover:scale-105"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-600 mt-6">
            <p className="text-lg">No favorite dogs yet.</p>
            
          </div>
        )}

        {favoriteDogs.length > 0 && (
          <button
            onClick={handleMatch}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105"
          >
            Find Your Match
          </button>
        )}
      </div>

      {/* Match Modal */}
      {showModal && match && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Your Match!</h2>
            <DogCard dog={match} onFavorite={() => {}} isFavorited={true} />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
