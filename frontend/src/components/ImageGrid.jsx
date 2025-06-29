import styles from './ImageGrid.module.css';
import {
  FaHeart,
  FaRegComment,
  FaDownload,
  FaTrashAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const STATIC = import.meta.env.VITE_STATIC_URL || 'http://localhost:5000';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ImageGrid({ images, showUploader = false, showDelete = false, onDelete }) {
  return (
    <div className={styles.grid}>
      {images.map((img) => (
        <ImageCard
          key={img._id}
          img={img}
          showUploader={showUploader}
          showDelete={showDelete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function ImageCard({ img, showUploader, showDelete, onDelete }) {
  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Array.isArray(img.likes) ? img.likes.length : img.likes || 0);

  const [comments] = useState(img.comments?.length || 0);
  const [downloads, setDownloads] = useState(img.downloads || 0);

  useEffect(() => {
  if (user && Array.isArray(img.likes) && img.likes.includes(user.id)) {
    setLiked(true);
  }
}, [user, img.likes]);

  const toggleLike = async () => {
    try {
      const res = await fetch(`${API}/images/${img._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vistavibes-token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setLikes(data.likes);
      } else {
        alert(data.message || 'Failed to like');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`${API}/images/${img._id}/download`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setDownloads(data.downloads);
      }

      const link = document.createElement('a');
      link.href = `${STATIC}${img.imageUrl}`;
      link.download = img.title || 'vistavibes_image';
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`${API}/images/${img._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vistavibes-token')}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Image deleted successfully');
        if (onDelete) onDelete(img._id);
      } else {
        alert(data.message || '❌ Failed to delete image');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('❌ Network error while deleting image');
    }
  };

  const uploaderName = img.uploadedBy?.name || 'VistaVibes';
  const uploaderAvatar = img.uploadedBy?.profilePic
    ? `${STATIC}${img.uploadedBy.profilePic}`
    : '/default-avatar.png';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img src={uploaderAvatar} alt="Uploader" className={styles.avatar} />
        <span className={styles.username}>
          {showUploader ? uploaderName : 'VistaVibes'}
        </span>
        {showDelete && (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            <FaTrashAlt />
          </button>
        )}
      </div>

      <img
        src={`${STATIC}${img.imageUrl}`}
        alt={img.title}
        className={styles.image}
      />

      {img.title && <p className={styles.caption}>{img.title}</p>}

      <div className={styles.footer}>
        <div className={styles.actions}>
          <button
            className={`${styles.iconBtn} ${liked ? styles.liked : ''}`}
            onClick={toggleLike}
          >
            <FaHeart /> <span>{likes}</span>
          </button>
          <button className={styles.iconBtn}>
            <FaRegComment /> <span>{comments}</span>
          </button>
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload}>
          <FaDownload /> <span>{downloads}</span>
        </button>
      </div>
    </div>
  );
}
