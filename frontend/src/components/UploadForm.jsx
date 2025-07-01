// UploadForm.jsx
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import styles from './UploadForm.module.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🔽 Define categories list
const categories = [
  'Nature', 'Flowers', 'Sky', 'Hills', 'Trees',
  'House', 'Computer', 'Machine', 'Ground', 'Other'
];

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login to upload.');
      return;
    }

    if (!file || !title || !category) {
      alert('Please provide all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', category);
    if (tags) formData.append('tags', tags);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/images/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);
      if (xhr.status === 201) {
        alert('✅ Uploaded successfully!');
        setFile(null);
        setTitle('');
        setCategory('');
        setTags('');
        setPreviewUrl('');
        setUploadProgress(0);
      } else {
        const response = JSON.parse(xhr.responseText);
        alert(response.message || '❌ Upload failed.');
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      alert('❌ Network error. Please try again.');
    };

    setLoading(true);
    xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Image File</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      {previewUrl && (
        <div className={styles.previewContainer}>
          <img src={previewUrl} alt="Preview" className={styles.previewImage} />
        </div>
      )}

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

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full border rounded p-2"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Tags (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g. sunset, ocean, beach"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      {loading && (
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? `Uploading... ${uploadProgress}%` : 'Upload'}
      </button>
    </form>
  );
}
