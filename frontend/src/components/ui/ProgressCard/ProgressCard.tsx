import React from 'react';
import './ProgressCard.scss';

interface ProgressCardProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  icon?: string;
  onClick?: () => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ label, value, max, color = '#7c3aed', icon, onClick }) => {
  const pct = Math.round((value / Math.max(max, 1)) * 100);

  return (
    <div className="progress-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="progress-card__header">
        {icon && <span className="progress-card__icon">{icon}</span>}
        <span className="progress-card__label">{label}</span>
        <span className="progress-card__value">{value}/{max}</span>
      </div>
      <div className="progress-card__track">
        <div className="progress-card__fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  );
};

export default ProgressCard;
