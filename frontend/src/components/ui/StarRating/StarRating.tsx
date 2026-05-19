import React from 'react';
import './StarRating.scss';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, size = 'sm', showValue = true }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
    <span className={`star-rating star-rating--${size}`}>
      {Array.from({ length: full }, (_, i) => <i key={`f${i}`} className="fa-solid fa-star" />)}
      {half && <i className="fa-solid fa-star-half-stroke" />}
      {Array.from({ length: empty }, (_, i) => <i key={`e${i}`} className="fa-regular fa-star" />)}
      {showValue && <span className="star-rating__value">{rating.toFixed(1)}</span>}
    </span>
  );
};

export default StarRating;
