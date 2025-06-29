// src/pages/ImageView.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export default function ImageView() {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API}/images/${id}`);
        const data = await res.json();

        if (res.ok) {
          setImage(data);
        } else {
          setError(data.message || 'Image not found.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    };

    fetchImage();
  }, [id]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'vistavibes-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!image) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img
        src={image.url}
        alt={image.title}
        className="w-full rounded shadow mb-6"
      />
      <h2 className="text-2xl font-bold mb-2">{image.title}</h2>
      <button
        onClick={handleDownload}
        className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Download
      </button>
    </div>
  );
}
