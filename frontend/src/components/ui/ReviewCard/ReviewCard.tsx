import React from 'react';
import './ReviewCard.scss';

interface ReviewCardProps {
  rating: number;
  title: string;
  body?: string;
  platform?: string;
  gameTitle: string;
  onClick?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ rating, title, body, platform, gameTitle, onClick }) => {
  return (
    <div className="review-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="review-card__stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
      <div className="review-card__content">
        <span className="review-card__title">{title}</span>
        <span className="review-card__game">{gameTitle}{platform ? ` · ${platform}` : ''}</span>
        {body && <p className="review-card__body">{body}</p>}
      </div>
    </div>
  );
};

export default ReviewCard;
