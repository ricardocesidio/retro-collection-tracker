import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import NotificationBell from '../../ui/NotificationBell/NotificationBell';
import './MobileBottomNav.scss';

const MobileBottomNav: React.FC = () => {
  const { state } = useAuth();
  if (!state.user) return null;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/add-game" className="mobile-bottom-nav__btn" title="Add to Collection">
        <i className="fa-solid fa-plus" />
      </Link>
      <Link to="/wishlist" className="mobile-bottom-nav__btn" title="Wishlist">
        <i className="fa-solid fa-star" />
      </Link>
      <Link to="/messages" className="mobile-bottom-nav__btn" title="Messages">
        <i className="fa-solid fa-envelope" />
      </Link>
      <Link to="/trade" className="mobile-bottom-nav__btn" title="Trade Requests">
        <i className="fa-solid fa-handshake" />
      </Link>
      <Link to="/notifications" className="mobile-bottom-nav__btn">
        <NotificationBell />
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
