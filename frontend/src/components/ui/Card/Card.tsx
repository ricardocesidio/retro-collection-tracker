import React from 'react';
import './Card.scss';

interface CardProps {
  imageUrl?: string;
  title?: string;
  badge?: string;
  clickable?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  badge,
  clickable = false,
  footer,
  children,
}) => {
  return (
    <div className={`card${clickable ? ' card--clickable' : ''}`}>
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
