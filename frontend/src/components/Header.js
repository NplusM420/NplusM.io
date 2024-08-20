import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li><Link to="/" className={styles.navItem}>Home</Link></li>
          <li><Link to="/about" className={styles.navItem}>About</Link></li>
          <li><Link to="/portfolio" className={styles.navItem}>Portfolio</Link></li>
          <li><Link to="/services" className={styles.navItem}>Services</Link></li>
          <li><Link to="/timeline" className={styles.navItem}>Timeline</Link></li>
          <li><Link to="/current-projects" className={styles.navItem}>Current Projects</Link></li>
          <li><Link to="/contact" className={styles.navItem}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;