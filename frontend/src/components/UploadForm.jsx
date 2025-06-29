// src/components/UploadForm.jsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

    try {
      setLoading(true);
      const res = await fetch(`${API}/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('✅ Uploaded successfully!');
        setFile(null);
        setTitle('');
      } else {
        alert(data.message || '❌ Upload failed.');
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Image File</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Image Title</label>
        <input
          type="text"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
