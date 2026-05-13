import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { notificationsApi } from '../../../services/social';
import './Header.scss';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = state;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    notificationsApi.getUnreadCount().then((r) => setUnreadCount(r.count)).catch(() => {});
    const interval = setInterval(() => {
      notificationsApi.getUnreadCount().then((r) => setUnreadCount(r.count)).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    ...(user
      ? [
          { label: 'My Collection', path: '/collection' },
          { label: 'Wishlist', path: '/wishlist' },
          { label: 'Dashboard', path: '/dashboard' },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

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
              className={({ isActive }) => `header__link${isActive ? ' active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          {user ? (
            <>
              <Link to="/notifications" className="header__notif-bell" aria-label="Notifications">
                🔔
                {unreadCount > 0 && <span className="header__notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </Link>
              <Link
                to={`/profile/${user.username}`}
                className="header__link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user.displayName || user.username}
              </Link>
              <Link to="/settings" className="header__link header__link--auth">
                Settings
              </Link>
              <button onClick={handleLogout} className="header__link header__link--auth">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link header__link--auth">
                Sign In
              </Link>
              <Link to="/register" className="header__cta">
                Sign Up
              </Link>
            </>
          )}
          <button
            className={`header__menu-btn${mobileMenuOpen ? ' header__menu-btn--open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
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
