import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // 👈 new

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      setAuthChecked(true);
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
      setLoading(true);

      const res = await fetch(`${API}/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('✅ Image uploaded to VistaVibes!');
        setFile(null);
        setTitle('');
      } else {
        alert(data.message || '❌ Upload failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Network error. Please try again later.');
    }
  };

  // 👉 Show loader while checking auth
  if (!authChecked) return <p className="loader">Checking login...</p>;

  return (
    <div className="container">
      <h2 className="page-title">Upload to VistaVibes</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
