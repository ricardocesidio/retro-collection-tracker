import React from 'react';
import './StatCard.scss';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  accent?: 'purple' | 'blue' | 'green' | 'amber' | 'red';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accent = 'purple', trend }) => {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon"><i className={icon} /></div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>
    </div>
  );
};

export default StatCard;
