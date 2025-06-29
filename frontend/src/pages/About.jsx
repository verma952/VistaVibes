// === FILE: pages/About.jsx ===
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.aboutWrapper}>
      <div className={styles.contentBox}>
        <h1 className={styles.heading}>About VistaVibes</h1>
        <p className={styles.paragraph}>
          VistaVibes is your one-stop platform for discovering and sharing high-definition wallpapers across various categories. Whether you're a photographer, a designer, or just someone who appreciates beautiful visuals, VistaVibes offers a vibrant community to showcase your creativity.
        </p>
        <p className={styles.paragraph}>
          We aim to make high-quality visual content accessible to everyone. Upload your unique visuals, explore inspiring collections, or simply find the perfect wallpaper for your device — all for free.
        </p>
        <p className={styles.paragraph}>
          Built with ❤️ using the MERN stack, VistaVibes is continuously evolving. We welcome suggestions and collaborations — because the vibe is better when we build together.
        </p>
      </div>
    </div>
  );
}
