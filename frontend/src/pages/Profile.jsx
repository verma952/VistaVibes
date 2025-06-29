import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import ImageGrid from '../components/ImageGrid';
import styles from './Profile.module.css';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const STATIC = import.meta.env.VITE_STATIC_URL || 'http://localhost:5000';

export default function Profile() {
  const { user, token, logout, login, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.email) {
        setProfile(data);

        // ✅ Update user context with _id, needed for filtering images
        const updatedUser = {
          _id: data._id,
          email: data.email,
          name: data.name,
          profilePic: data.profilePic
        };

        login({ user: updatedUser, token });
        setName(data.name || '');
      } else {
        console.warn('Invalid profile data:', data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const fetchUserImages = async () => {
    try {
      const res = await fetch(`${API}/images/all`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.images)) {
        const userOnly = data.images.filter(img => img.uploadedBy?._id === user?._id);
        setUserImages(userOnly);
      }
    } catch (err) {
      console.error('Error fetching user images:', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const res = await fetch(`${API}/user/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.name) {
        const updatedUser = {
          ...user,
          name: data.name,
          profilePic: data.profilePic
        };

        setProfile(updatedUser);
        login({ user: updatedUser, token });
        setEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchProfile();
      fetchUserImages();
    }
  }, [authLoading, token]);

  if (authLoading || pageLoading) {
    return <div className={styles.loader}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <img
            src={profile?.profilePic ? `${STATIC}${profile.profilePic}` : '/default-avatar.png'}
            alt="Profile"
          />
        </div>
        <div className={styles.info}>
          {editing ? (
            <>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </>
          ) : (
            <>
              <h2>{profile?.name || 'Anonymous'}</h2>
              <p>{profile?.email}</p>
            </>
          )}
        </div>

        <div className={styles.actions}>
          {editing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          )}
          <button className={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {userImages.length > 0 && (
        <ImageGrid
          images={userImages}
          showUploader={true}
          showDelete={true}
          onDelete={(id) =>
            setUserImages((prev) => prev.filter((img) => img._id !== id))
          }
        />
      )}
    </div>
  );
}
