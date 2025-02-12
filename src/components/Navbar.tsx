import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../pages/LoginPage";

interface NavbarProps {
  isAuthenticated: boolean;
  setAuth: (auth: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setAuth }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white w-full p-4 sm:px-8 flex justify-between items-center max-w-7xl mx-auto">
      <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
        Fetch Dog App
      </h1>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {isAuthenticated && (
          <>
            <button
              onClick={() => navigate("/search")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Search
            </button>
            <button
              onClick={() => navigate("/favorites")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Favorites
            </button>
          </>
        )}
        <button
          onClick={() => navigate("/about")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        >
          About the Author
        </button>
        {isAuthenticated ? (
          <button
            onClick={() => logout(setAuth)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;