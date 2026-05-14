import React from 'react';
import './ActivityItem.scss';

interface ActivityItemProps {
  icon: string;
  iconBg?: string;
  message: string;
  highlight?: string;
  timestamp: string;
  onClick?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, iconBg, message, highlight, timestamp, onClick }) => {
  return (
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
};

export default ActivityItem;
