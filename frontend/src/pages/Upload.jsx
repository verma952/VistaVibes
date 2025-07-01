import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import styles from './Upload.module.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = [
  'Nature', 'Flowers', 'Sky', 'Hills', 'Trees',
  'House', 'Computer', 'Machine', 'Ground', 'Other'
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

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

    if (!file || !title || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);
    if (tags) formData.append('tags', tags);

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
        setCategory('');
        setTags('');
      } else {
        alert(data.message || '❌ Upload failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      alert('❌ Network error. Please try again later.');
    }
  };

  if (!authChecked) return <p className="text-center py-8 text-gray-500">Checking login...</p>;

  return (
    <div className={styles.container}>
  <h2 className={styles.pageTitle}>Upload to VistaVibes</h2>

  <form onSubmit={handleSubmit}>
    <div className={styles.formGroup}>
      <label className={styles.label}>Image File</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Image Title</label>
      <input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className={styles.select}
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat} value={cat.toLowerCase()}>{cat}</option>
        ))}
      </select>
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Tags (optional)</label>
      <input
        type="text"
        placeholder="e.g. tree, river"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={styles.input}
      />
    </div>

    <button type="submit" disabled={loading} className={styles.button}>
      {loading ? 'Uploading...' : 'Upload'}
    </button>
  </form>
</div>

  );
}
