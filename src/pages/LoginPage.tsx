import React, { useState } from "react";
import axios from "axios";

interface LoginPageProps {
  setAuth: (auth: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAuth }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { name, email }, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        const token = response.headers["set-cookie"] || null;
        console.log(token);
        setAuth(true);
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your details and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-sm w-full text-center mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Fetch!</h1>
        <p className="text-gray-500 mb-4">Find your perfect dog match 🐶</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

export const logout = async (setAuth: (auth: boolean) => void) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    setAuth(false);
  } catch (error) {
    console.error("Logout failed", error);
  }
};
