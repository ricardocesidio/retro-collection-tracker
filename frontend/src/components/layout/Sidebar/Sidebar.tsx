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
      { icon:'fa-solid fa-border-all', label:'Dashboard', path:'/dashboard' },
      { icon:'fa-solid fa-layer-group', label:'Collection', path:'/collection' },
      { icon:'fa-solid fa-star', label:'Wishlist', path:'/wishlist' },
      { icon:'fa-solid fa-compass', label:'Explore', path:'/explore' },
      { icon:'fa-solid fa-bookmark', label:'Reviews', path:'/reviews' },
    ]},
    { label: 'Discover', items: [
      { icon:'fa-solid fa-gamepad', label:'Platforms', path:'/platforms' },
      { icon:'fa-solid fa-tag', label:'Genres', path:'/genres' },
    ]},
    { label: 'Social', items: [
      { icon:'fa-solid fa-clock', label:'Activity', path:'/activity' },
      { icon:'fa-solid fa-users', label:'Friends', path:'/friends' },
      { icon:'fa-solid fa-bell', label:'Notifications', path:'/notifications' },
      { icon:'fa-solid fa-circle-user', label:'Profile', path: user ? `/profile/${user.username}` : '/login' },
    ]},
    { label: 'Settings', items: [
      { icon:'fa-solid fa-gear', label:'Settings', path:'/settings' },
      { icon:'fa-solid fa-heart', label:'Donate', path:'/donate' },
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
        </div>
        <nav className="sidebar__nav">
          {sections.map((s) => (
            <div key={s.label} className="sidebar__section">
              <span className="sidebar__section-label">{s.label}</span>
              {s.items.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'}
                  className={({isActive}) => `sidebar__item${isActive?' sidebar__item--active':''}`}
                  onClick={() => setOpen(false)}>
                  <span className="sidebar__item-icon"><i className={item.icon} /></span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar__progress">
          <div className="sidebar__progress-header"><span>Collection Progress</span><span className="sidebar__progress-pct">78%</span></div>
          <div className="sidebar__progress-track"><div className="sidebar__progress-fill" /></div>
          <p className="sidebar__progress-hint">12 of 15 SNES games collected</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
