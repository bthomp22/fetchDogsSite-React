import React, { useState } from "react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  breed: string;
  zip_code?: string;
  state?: string;
}

interface DogCardProps {
  dog: Dog;
  onFavorite: (id: string) => void;
  isFavorited: boolean;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onFavorite, isFavorited }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition duration-300 relative">
      <img
        src={imageError ? "/placeholder-dog.jpg" : dog.img}
        alt={dog.name}
        className="w-full h-40 sm:h-52 md:h-64 object-contain rounded-md"
        onError={() => setImageError(true)} 
      />

      <h3 className="text-lg font-semibold mt-2">{dog.name}</h3>
      <p className="text-gray-600">Breed: {dog.breed}</p>
      <p className="text-gray-600">Age: {dog.age} years</p>
      <p className="text-gray-600">State: {dog.state || "Unknown"}</p>

     
      <button
        onClick={() => onFavorite(dog.id)}
        className={`mt-2 py-3 px-6 rounded w-full text-sm sm:text-base lg:text-lg transition-transform transform hover:scale-105 ${
          isFavorited ? "bg-red-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isFavorited ? "Favorited ❤️" : "Add to Favorites"}
      </button>
    </div>
  );
};

export default DogCard;