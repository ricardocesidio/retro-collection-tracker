import React from 'react';
import './ActivityItem.scss';

interface ActivityItemProps {
  icon: string;
  message: string;
  timestamp: string;
  onClick?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, message, timestamp, onClick }) => {
  return (
    <div className="activity-item" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <span className="activity-item__icon"><i className={icon} /></span>
      <span className="activity-item__msg" dangerouslySetInnerHTML={{ __html: message }} />
      <span className="activity-item__time">{timestamp}</span>
    </div>
  );
};

export default ActivityItem;
