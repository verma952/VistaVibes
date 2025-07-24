// === FILE: components/Footer.jsx ===
import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { FaInstagram, FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/visits`)
      .then(res => res.json())
      .then(data => setCount(data.count));
  }, []);


  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2>VistaVibes</h2>
          <p>Discover, upload and share high-quality wallpapers for free. Built with ❤️ for creative minds.</p>
          <p className={styles.developer}>Support: <a href="mailto:developervasu91@gmail.com">developervasu91@gmail.com</a></p>
        </div>
        <div className={styles.right}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/upload">Upload</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/vasu_developer" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://www.youtube.com/@vasu_developer" target="_blank" rel="noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className={styles.visitCount}>
        <p>Total Visiters: {count}</p>
      </div>
      <div className={styles.copy}>© 2025 VistaVibes. All rights reserved.</div>
    </footer>
  );
}
