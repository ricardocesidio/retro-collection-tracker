import React from 'react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title = 'Nothing here yet',
  message,
  children,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
};

export default EmptyState;
