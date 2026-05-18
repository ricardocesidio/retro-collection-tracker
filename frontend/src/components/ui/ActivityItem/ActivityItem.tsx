import React from 'react';
import { Link } from 'react-router-dom';
import './ActivityItem.scss';

interface ActivityItemProps {
  icon: string;
  iconBg?: string;
  message: string;
  highlight?: string;
  timestamp: string;
  onClick?: () => void;
  to?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, iconBg, message, highlight, timestamp, onClick, to }) => {
  const content = (
    <div className="activity-item" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="activity-item__avatar" style={iconBg ? { background: iconBg } : undefined}>
        <i className={icon} />
      </div>
      <span className="activity-item__msg">
        {highlight ? (
          <>
            <span className="activity-item__highlight">{highlight}</span> {message}
          </>
        ) : (
          message
        )}
      </span>
      <span className="activity-item__time">{timestamp}</span>
    </div>
  );

  if (to) return <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>;
  return content;
};

export default ActivityItem;
