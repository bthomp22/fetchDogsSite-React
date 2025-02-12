import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import MatchPage from './pages/MatchPage';
import AboutPage from './pages/AboutPage.tsx';
import FavoritesPage from './pages/FavoritesPage.tsx';
import Navbar from './components/Navbar';
import axios from 'axios';
import './App.css';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/auth/check`, { withCredentials: true })
      .then(response => setIsAuthenticated(response.data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <Router basename='/fetchDogsSite-React/'>
      <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/search" /> : <LoginPage setAuth={setIsAuthenticated} />} />
        
        <Route path="/search" element={isAuthenticated ? <SearchPage favorites={favorites} setFavorites={setFavorites} /> : <Navigate to="/" />} />
        <Route path="/match" element={isAuthenticated ? <MatchPage favorites={[]} /> : <Navigate to="/" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/favorites" element={isAuthenticated ? <FavoritesPage favorites={favorites} setFavorites={setFavorites} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;