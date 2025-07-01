// === FILE: components/Navbar.jsx ===
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../auth/AuthContext';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProtectedClick = (path) => {
    if (!user) {
      setShowLogin(true);
    } else {
      navigate(path);
      setIsOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>VistaVibes</div>

        <div
          className={styles.menuToggle}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </div>

        <div className={`${styles.links} ${isOpen ? styles.showMenu : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/upload">
          <span onClick={() => handleProtectedClick('/upload')}>Upload</span>
          </Link>

          {!user ? (
            <span onClick={() => setShowLogin(true)}>Login</span>
          ) : (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  navigate('/');
                }}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
}
