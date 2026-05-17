import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../../../services/social';
import { connectSocket } from '../../../services/socket';
import './NotificationBell.scss';

interface NotificationBellProps {
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    notificationsApi.getUnreadCount().then((r: any) => setCount(r.count || 0)).catch(() => {});
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = connectSocket(token);
    const handler = (data: { count: number }) => setCount(data.count);
    socket.on('notification:unread', handler);
    return () => { socket.off('notification:unread', handler); };
  }, []);

  return (
    <button className="notif-bell" onClick={onClick} aria-label={`Notifications${count > 0 ? `: ${count} unread` : ''}`}>
      <span className="notif-bell__icon"><i className="fa-solid fa-bell" /></span>
      {count > 0 && <span className="notif-bell__badge">{count > 99 ? '99+' : count}</span>}
    </button>
  );
};

export default NotificationBell;
