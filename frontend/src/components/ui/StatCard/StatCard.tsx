import React from 'react';
import './StatCard.scss';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  accent?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'cyan';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accent = 'purple', trend }) => {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {trend && <div className="stat-card__trend">{trend}</div>}
    </div>
  );
};

export default StatCard;
