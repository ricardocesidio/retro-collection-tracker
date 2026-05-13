import React from 'react';
import './Card.scss';

interface CardProps {
  imageUrl?: string;
  title?: string;
  badge?: string;
  clickable?: boolean;
  onClick?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  badge,
  clickable = false,
  onClick,
  footer,
  children,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={`card${clickable ? ' card--clickable' : ''}`}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      aria-label={clickable && title ? title : undefined}
    >
      {imageUrl && (
        <div className="card__image">
          <img src={imageUrl} alt={title || 'Card image'} loading="lazy" />
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
