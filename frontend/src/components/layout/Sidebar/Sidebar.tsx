import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;

  const sections = [
    {
      label: 'Main',
      items: [
        { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
        { icon: '📚', label: 'My Collection', path: '/collection' },
        { icon: '🔍', label: 'Explore', path: '/explore' },
        { icon: '⭐', label: 'Wishlist', path: '/wishlist' },
      ],
    },
    {
      label: 'Social',
      items: [
        { icon: '👤', label: 'Profile', path: user ? `/profile/${user.username}` : '/login' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '⚙️', label: 'Settings', path: '/settings' },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">🎮</span>
        <div>
          <span className="sidebar__title">RetroTracker</span>
          <span className="sidebar__subtitle">Collection Hub</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {sections.map((section) => (
          <div key={section.label} className="sidebar__section">
            <span className="sidebar__section-label">{section.label}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `sidebar__item${isActive ? ' sidebar__item--active' : ''}`
                }
              >
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.label}</span>
                {item.label === 'Notifications' && (
                  <span className="sidebar__badge">3</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {user && (
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            {(user.displayName || user.username).charAt(0).toUpperCase()}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user.displayName || user.username}</span>
            <span className="sidebar__user-role">Collector</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
