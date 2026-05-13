import React from 'react';
import './NotificationBell.scss';

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, onClick }) => {
  return (
    <button className="notif-bell" onClick={onClick} aria-label={`Notifications${count > 0 ? `: ${count} unread` : ''}`}>
      <span className="notif-bell__icon"><i className="fa-solid fa-bell" /></span>
      {count > 0 && <span className="notif-bell__badge">{count > 99 ? '99+' : count}</span>}
    </button>
  );
};

export default NotificationBell;
