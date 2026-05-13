import React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullPage = false,
}) => {
  return (
    <div className={`loading-spinner${fullPage ? ' loading-spinner--full' : ''}`}>
      <div className="loading-spinner__ring" />
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
