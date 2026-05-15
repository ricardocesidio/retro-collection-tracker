import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { gamesApi } from '../../../services/collections';
import NotificationBell from '../../ui/NotificationBell/NotificationBell';
import ProfileChip from '../../ui/ProfileChip/ProfileChip';
import DropdownMenu from '../../ui/DropdownMenu/DropdownMenu';
import './TopBar.scss';

const PLACEHOLDER_COVER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52"><rect fill="#1e1b4b" width="40" height="52"/><text x="20" y="28" text-anchor="middle" fill="#4c1d95" font-size="14" font-family="sans-serif">🎮</text></svg>');

const TopBar: React.FC = () => {
  const { state, logout } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; platform: string; coverImageUrl?: string; releaseYear: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingSuggest, setSearchingSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchVal.trim() || searchVal.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    setSearchingSuggest(true);
    const timer = setTimeout(async () => {
      try {
        const res = await gamesApi.list({ search: searchVal.trim(), limit: '6' });
        setSuggestions(res.data.map(g => ({ id: g.id, title: g.title, platform: g.platform.name, coverImageUrl: g.coverImageUrl, releaseYear: g.releaseYear })));
        setShowSuggestions(true);
      } catch { setSuggestions([]); } finally { setSearchingSuggest(false); }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      setShowSuggestions(false);
      navigate(`/explore?search=${encodeURIComponent(searchVal.trim())}`);
    }
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const goToGame = (id: string) => {
    setShowSuggestions(false);
    setSearchVal('');
    navigate(`/games/${id}`);
  };

  return (
    <header className="topbar">
      <div className="topbar__search" ref={suggestRef}>
        <span className="topbar__search-icon"><i className="fa-solid fa-magnifying-glass" /></span>
        <input className="topbar__search-input" type="text" placeholder="Search games, platforms, collectors..." value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleSearch} onFocus={() => { if (suggestions.length) setShowSuggestions(true); }} />
        {showSuggestions && suggestions.length > 0 && (
          <div className="topbar__suggestions">
            {suggestions.map((g) => (
              <button key={g.id} className="topbar__suggestion" onClick={() => goToGame(g.id)} onMouseDown={(e) => e.preventDefault()}>
                <img src={g.coverImageUrl || PLACEHOLDER_COVER} alt="" className="topbar__suggestion-img" />
                <div className="topbar__suggestion-info">
                  <span className="topbar__suggestion-title">{g.title}</span>
                  <span className="topbar__suggestion-meta">{g.platform} · {g.releaseYear}</span>
                </div>
              </button>
            ))}
            <button className="topbar__suggestion topbar__suggestion--view-all" onClick={() => { setShowSuggestions(false); navigate(`/explore?search=${encodeURIComponent(searchVal.trim())}`); }}>
              <i className="fa-solid fa-magnifying-glass" /> View all results
            </button>
          </div>
        )}
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
