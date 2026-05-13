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
      <span className="stat-card__label">{label}</span>
      <div className="stat-card__icon"><i className={icon} /></div>
      <span className="stat-card__value">{value}</span>
      {trend && <span className="stat-card__trend">{trend}</span>}
    </div>
  );
};

export default StatCard;
