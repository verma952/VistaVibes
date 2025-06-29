import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = localStorage.getItem('pending-email');
    if (!email) {
      setLoading(false);
      return setError('Email not found. Please login again.');
    }

    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        login({ token: data.token, user: data.user });
        localStorage.removeItem('pending-email');
        navigate('/');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Verify OTP</h2>
      <form onSubmit={verify} className="form">
        <input
          type="text"
          placeholder="Enter OTP"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Login'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}
