import { useEffect, useState } from 'react';
import ImageGrid from '../components/ImageGrid';
import styles from './Home.module.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API}/images/all`);
        const data = await res.json();
        if (res.ok && data.success) {
          setImages(data.images || []);
        } else {
          setError(data.message || 'Failed to load images.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to VistaVibes</h1>
        <p className={styles.subtitle}>Discover & share beautiful HD wallpapers</p>
      </section>

      <section className={styles.gallery}>
        {loading ? (
          <p>Loading wallpapers...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <ImageGrid images={images} showUploader />
        )}
      </section>
    </div>
  );
}
