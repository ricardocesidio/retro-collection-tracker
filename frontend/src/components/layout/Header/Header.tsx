import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'My Collection', path: '/collection' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="header__logo-icon">🎮</span>
          <span className="header__logo-text">RetroTracker</span>
        </Link>

        <nav className={`header__nav${mobileMenuOpen ? ' header__nav--open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `header__link${isActive ? ' active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/login" className="header__link header__link--auth">Sign In</Link>
          <Link to="/register" className="header__cta">Sign Up</Link>
          <button
            className={`header__menu-btn${mobileMenuOpen ? ' header__menu-btn--open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      {mobileMenuOpen && <div className="header__overlay" onClick={() => setMobileMenuOpen(false)} />}
    </header>
  );
};

export default Header;
