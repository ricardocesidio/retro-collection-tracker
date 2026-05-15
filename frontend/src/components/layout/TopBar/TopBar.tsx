import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import NotificationBell from '../../ui/NotificationBell/NotificationBell';
import ProfileChip from '../../ui/ProfileChip/ProfileChip';
import DropdownMenu from '../../ui/DropdownMenu/DropdownMenu';
import './TopBar.scss';

const TopBar: React.FC = () => {
  const { state, logout } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__search">
        <span className="topbar__search-icon"><i className="fa-solid fa-magnifying-glass" /></span>
        <input className="topbar__search-input" type="text" placeholder="Search games, platforms, collectors..." value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleSearch} />
      </div>

      <div className="topbar__actions">
        {user ? (
          <>
            <Link to="/add-game" className="topbar__add-btn" title="Add to Collection">
              <i className="fa-solid fa-plus" />
            </Link>
            <Link to="/notifications">
              <NotificationBell />
            </Link>
            <DropdownMenu
              trigger={<ProfileChip name={user.displayName || user.username} role={(user as any).level?.name || 'Collector'} avatar={user.avatarUrl || undefined} />}
              items={[
                { label: 'Profile', icon: 'fa-solid fa-circle-user', onClick: () => window.location.href = `/profile/${user.username}` },
                { label: 'Settings', icon: 'fa-solid fa-gear', onClick: () => window.location.href = '/settings' },
                { label: 'Logout', icon: 'fa-solid fa-right-from-bracket', onClick: logout, danger: true },
              ]}
            />
          </>
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
