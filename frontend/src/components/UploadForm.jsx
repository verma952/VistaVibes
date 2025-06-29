import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import styles from './UploadForm.module.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login to upload.');
      return;
    }

    if (!file || !title) {
      alert('Please provide all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);

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
