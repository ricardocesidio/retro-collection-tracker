import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.scss';

const Sidebar: React.FC = () => {
  const { state } = useAuth();
  const { user } = state;
  const [open, setOpen] = useState(false);

  const sections = [
    { label: 'Main', items: [
      { icon:'📊', label:'Dashboard', path:'/dashboard' },
      { icon:'📚', label:'Collection', path:'/collection' },
      { icon:'🔍', label:'Explore', path:'/explore' },
      { icon:'⭐', label:'Wishlist', path:'/wishlist' },
    ]},
    { label: 'Social', items: [
      { icon:'👤', label:'Profile', path: user ? `/profile/${user.username}` : '/login' },
      { icon:'🔔', label:'Notifications', path:'/notifications' },
    ]},
    { label: 'Settings', items: [
      { icon:'⚙️', label:'Settings', path:'/settings' },
    ]},
  ];

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
        <span/><span/><span/>
      </button>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}/>}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo">🎮</span>
          <div><span className="sidebar__title">RetroTracker</span><span className="sidebar__sub">Collector Hub</span></div>
        </div>
        <nav className="sidebar__nav">
          {sections.map((s) => (
            <div key={s.label} className="sidebar__section">
              <span className="sidebar__section-label">{s.label}</span>
              {s.items.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'}
                  className={({isActive}) => `sidebar__item${isActive?' sidebar__item--active':''}`}
                  onClick={() => setOpen(false)}>
                  <span className="sidebar__item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{(user.displayName||user.username).charAt(0).toUpperCase()}</div>
            <div><span className="sidebar__user-name">{user.displayName||user.username}</span><span className="sidebar__user-role">Collector</span></div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
