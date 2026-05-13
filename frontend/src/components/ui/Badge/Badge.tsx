import React from 'react';
import './Badge.scss';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'highlight';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  return <span className={`badge badge--${variant}`}>{children}</span>;
};

export default Badge;
