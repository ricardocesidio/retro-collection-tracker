import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../../../services/social';
import './NotificationBell.scss';

interface NotificationBellProps {
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    notificationsApi.getUnreadCount().then((r: any) => setCount(r.count || 0)).catch(() => {});
    const interval = setInterval(() => {
      notificationsApi.getUnreadCount().then((r: any) => setCount(r.count || 0)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button className="notif-bell" onClick={onClick} aria-label={`Notifications${count > 0 ? `: ${count} unread` : ''}`}>
      <span className="notif-bell__icon"><i className="fa-solid fa-bell" /></span>
      {count > 0 && <span className="notif-bell__badge">{count > 99 ? '99+' : count}</span>}
    </button>
  );
};

export default NotificationBell;
