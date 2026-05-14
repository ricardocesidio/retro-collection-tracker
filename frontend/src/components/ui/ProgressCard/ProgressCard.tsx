import React from 'react';
import './ProgressCard.scss';

interface ProgressCardProps {
  label: string;
  percentage: number;
  color?: string;
  onClick?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ label, percentage, color = '#7c3aed', onClick }) => {
  return (
    <div className="progress-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <span className="progress-card__label">{label}</span>
      <div className="progress-card__track">
        <div className="progress-card__fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
      <span className="progress-card__pct">{percentage}%</span>
    </div>
  );
};

export default ProgressCard;
