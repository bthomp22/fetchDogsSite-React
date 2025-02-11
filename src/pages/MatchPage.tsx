import React, { useState } from "react";
import axios from "axios";

const VITE_API_BASE_URL = "https://frontend-take-home-service.fetch.com";

interface MatchPageProps {
  favorites: string[];
}

const MatchPage: React.FC<MatchPageProps> = ({ favorites }) => {
  const [match, setMatch] = useState<string | null>(null);

  const findMatch = async () => {
    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/dogs/match`, favorites, { withCredentials: true });
      setMatch(response.data.match);
    } catch (error) {
      console.error("Match failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Your Match</h1>
      <button onClick={findMatch} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Find Match</button>
      {match && <p className="mt-2 text-lg">Matched Dog ID: {match}</p>}
    </div>
  );
};

export default MatchPage;

//"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"