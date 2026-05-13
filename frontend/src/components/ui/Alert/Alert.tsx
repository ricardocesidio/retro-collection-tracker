import React from 'react';
import './Alert.scss';

interface AlertProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  icon?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ variant = 'info', title, icon, children }) => {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      {icon && <span className="alert__icon">{icon}</span>}
      <div className="alert__content">
        {title && <strong className="alert__title">{title}</strong>}
        <p className="alert__message">{children}</p>
      </div>
    </div>
  );
};

export default Alert;
