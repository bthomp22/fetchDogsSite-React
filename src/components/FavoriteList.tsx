import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface FavoriteListProps {
  favorites: string[];
}

const FavoriteList: React.FC<FavoriteListProps> = ({ favorites }) => {
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindMatch = async () => {
    if (favorites.length === 0) {
      alert("No favorite dogs selected!");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/dogs/match`,
        favorites,
        { withCredentials: true }
      );
      if (response.data && response.data.match) {
        const matchId = response.data.match;
        const dogResponse = await axios.post(
          `${API_BASE_URL}/dogs`,
          [matchId],
          { withCredentials: true }
        );
        if (dogResponse.data.length > 0) {
          setMatchedDog(dogResponse.data[0]);
          setError(null);
        } else {
          setError("No match details found.");
        }
      } else {
        setError("No match found.");
      }
    } catch (error) {
      console.error("Error finding match:", error);
      setError("Failed to find a match. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">Favorites ({favorites.length})</h3>
      <button
        onClick={handleFindMatch}
        disabled={favorites.length === 0}
        className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        Find Match
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {matchedDog && (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-bold">You matched with:</h3>
          <img src={matchedDog.img} alt={matchedDog.name} className="w-full h-40 object-cover rounded-md mt-2" />
          <p className="mt-2 text-gray-600">Name: {matchedDog.name}</p>
          <p className="text-gray-600">Breed: {matchedDog.breed}</p>
          <p className="text-gray-600">Age: {matchedDog.age} years</p>
          <p className="text-gray-600">Location: {matchedDog.zip_code}</p>
        </div>
      )}
    </div>
  );
};

export default FavoriteList;
