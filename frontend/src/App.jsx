// === FILE: App.jsx ===
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

function AppRoutes() {
  const { loadingAuth } = useAuth(); // <-- must be provided by AuthContext

  if (loadingAuth) return <Loader />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/image/:id" element={<ImageView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/about" element={<About />} />
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
