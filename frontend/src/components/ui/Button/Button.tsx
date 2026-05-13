import React from 'react';
import './Button.scss';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading && <span className="btn__spinner" />}
      <span className={`btn__content${loading ? ' btn__content--hidden' : ''}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;
