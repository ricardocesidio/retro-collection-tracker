import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { notificationsApi } from '../../../services/social';
import { connectSocket } from '../../../services/socket';
import './MobileBottomNav.scss';

const MobileBottomNav: React.FC = () => {
  const { state } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    notificationsApi.getUnreadCount().then((r: any) => setCount(r.count || 0)).catch(() => {});
    const socket = connectSocket(token);
    const handler = (data: { count: number }) => setCount(data.count);
    socket.on('notification:unread', handler);
    return () => { socket.off('notification:unread', handler); };
  }, []);

  if (!state.user) return null;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/messages" className="mobile-bottom-nav__btn" title="Messages">
        <i className="fa-solid fa-envelope" />
      </Link>
      <Link to="/wishlist" className="mobile-bottom-nav__btn" title="Wishlist">
        <i className="fa-solid fa-star" />
      </Link>
      <Link to="/add-game" className="mobile-bottom-nav__btn" title="Add to Collection">
        <i className="fa-solid fa-plus" />
      </Link>
      <Link to="/notifications" className="mobile-bottom-nav__btn" title="Notifications">
        <i className="fa-solid fa-bell" />
        {count > 0 && <span className="mobile-bottom-nav__badge">{count > 99 ? '99+' : count}</span>}
      </Link>
      <Link to="/trade" className="mobile-bottom-nav__btn" title="Trade Requests">
        <i className="fa-solid fa-handshake" />
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
