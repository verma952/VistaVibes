// === FILE: App.jsx ===
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ImageView from './pages/ImageView';
import Profile from './pages/Profile';
import About from './pages/About';
import Login from './auth/Login';
import VerifyOtp from './auth/VerifyOtp';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Loader from './components/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
function AppRoutes() {
  const { loading } = useAuth();

   useEffect(() => {
    const visited = localStorage.getItem('vistavibes_visited');
    if (!visited) {
      fetch(`${API_URL}/visits`, { method: 'POST' }); // Only counts once per browser
      localStorage.setItem('vistavibes_visited', 'true');
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/" element={
         loading ? <Loader /> : <Home />} />
        <Route path="/upload" element={loading ? <Loader/>:<Upload />} />
        <Route path="/profile" element={loading ? <Loader/>:<Profile />} />
        <Route path="/image/:id" element={loading ? <Loader/>:<ImageView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={loading ? <Loader/>:<VerifyOtp />} />
        <Route path="/about" element={loading ? <Loader/>:<About />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
