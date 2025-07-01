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
      {/* upload your */}
      <section className={styles.upload}>
        <p className={styles.uploadText}>
          Share your own clicked wallpapers with the community. Click the button below to upload.
        </p>
        <a href="/upload" className={styles.uploadButton}>
          Upload Yours
        </a>
      </section>
      <section className={styles.intro}>
        <h2 className={styles.introTitle}>Explore Our Collection</h2>
        <p className={styles.introText}>
          Browse through our extensive collection of high-definition wallpapers, curated to enhance your digital experience.
        </p>
          <div className={styles.category}>
            <h3 className={styles.categoryTitle}>Categories</h3>
             {/* grid for categories */}
              <div className={styles.categoryGrid}>
                <a href="#" className={styles.categoryItem}> Nature</a>
                <a href="#" className={styles.categoryItem}> Cityscapes</a>
                <a href="#" className={styles.categoryItem}> Abstract</a>
                <a href="#" className={styles.categoryItem}> Animals</a>
                <a href="#" className={styles.categoryItem}> Technology</a>
                <a href="#" className={styles.categoryItem}> People</a>
                <a href="#" className={styles.categoryItem}> Food</a>
                <a href="#" className={styles.categoryItem}> Landscapes</a>
                <a href="#" className={styles.categoryItem}> Space</a>
                <a href="#" className={styles.categoryItem}>Other</a>
              </div>
          </div>
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
