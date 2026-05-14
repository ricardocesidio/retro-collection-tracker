import React from 'react';
import './ReviewCard.scss';

interface ReviewCardProps {
  coverImageUrl?: string | null;
  gameTitle: string;
  platform: string;
  rating: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ coverImageUrl, gameTitle, platform, rating }) => {
  const score = ((rating / 5) * 10).toFixed(1);
  return (
    <div className="review-card">
      <div className="review-card__img">
        <img src={coverImageUrl || `https://placehold.co/80x56/141829/f0f4ff?text=${encodeURIComponent(gameTitle.slice(0, 4))}`} alt="" loading="lazy" />
      </div>
      <div className="review-card__info">
        <span className="review-card__title">{gameTitle}</span>
        <span className="review-card__meta">{platform}</span>
        <span className="review-card__stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
      </div>
      <div className="review-card__badge">{score}</div>
    </div>
  );
};

export default ReviewCard;
