import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🎮 RetroTracker</span>
          <p className="footer__tagline">Your retro gaming collection, beautifully organized.</p>
        </div>
        <div className="footer__links">
          <Link to="/explore">Explore</Link>
          <Link to="/collection">My Collection</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="footer__bottom">
          <p>&copy; {year} Retro Collection Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
