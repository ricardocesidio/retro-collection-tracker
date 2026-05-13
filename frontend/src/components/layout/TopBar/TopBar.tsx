import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './TopBar.scss';

const TopBar: React.FC = () => {
  const { state, logout } = useAuth();
  const { user } = state;

  return (
    <header className="topbar">
      <div className="topbar__search">
        <span className="topbar__search-icon">🔍</span>
        <input className="topbar__search-input" type="text" placeholder="Search games, collections, collectors..." />
      </div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn" aria-label="Notifications">
          🔔
          <span className="topbar__badge">3</span>
        </button>

        {user ? (
          <div className="topbar__profile">
            <div className="topbar__avatar">
              {(user.displayName || user.username).charAt(0).toUpperCase()}
            </div>
            <div className="topbar__profile-info">
              <span className="topbar__profile-name">{user.displayName || user.username}</span>
              <span className="topbar__profile-role">Collector</span>
            </div>
            <button className="topbar__logout" onClick={logout} title="Logout">⏻</button>
          </div>
        ) : (
          <div className="topbar__auth-links">
            <Link to="/login" className="topbar__auth-btn">Sign In</Link>
            <Link to="/register" className="topbar__auth-btn topbar__auth-btn--primary">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
