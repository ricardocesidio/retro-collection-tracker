import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { gamesApi } from '../../services/collections';
import type { GameData } from '../../services/collections';
import './GameDetails.scss';

interface GameWithReviews extends GameData {
  avgRating?: number | null;
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    body?: string;
    createdAt: string;
    user: { id: string; username: string; displayName?: string; avatarUrl?: string };
  }>;
}

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    gamesApi.getById(id)
      .then((data) => setGame(data as GameWithReviews))
      .catch((err) => setError(err.message || 'Game not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage message="Loading game details..." />;

  if (error || !game) {
    return (
      <div className="page-container">
        <EmptyState icon="🎮" title="Game not found" message="This game doesn't exist or has been removed.">
          <Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link>
        </EmptyState>
      </div>
    );
  }

  const avgRating = game.avgRating ? parseFloat(game.avgRating.toFixed(1)) : null;

  return (
    <div className="page-container">
      <Link to="/explore" className="game-detail__back">
        ← Back to Catalog
      </Link>

      <div className="game-detail">
        <div className="game-detail__image">
          <div className="game-detail__image-wrapper">
            <img
              src={game.coverImageUrl || `https://placehold.co/600x800/1a1a30/e0e0e0?text=${encodeURIComponent(game.title)}`}
              alt={game.title}
            />
            <div className="game-detail__image-badge">{game.platform.name}</div>
          </div>
        </div>

        <div className="game-detail__info">
          <div className="game-detail__header">
            <h1 className="game-detail__title">{game.title}</h1>
            <div className="game-detail__tags">
              <Badge variant="info">{game.platform.name}</Badge>
              <Badge variant="default">{game.genre.name}</Badge>
              <Badge variant="highlight">{game.releaseYear}</Badge>
            </div>
          </div>

          <div className="game-detail__meta-grid">
            <div className="meta-item">
              <span className="meta-item__label">Developer</span>
              <span className="meta-item__value">{game.developer || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Publisher</span>
              <span className="meta-item__value">{game.publisher || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Platform</span>
              <span className="meta-item__value">{game.platform.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Genre</span>
              <span className="meta-item__value">{game.genre.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Release Year</span>
              <span className="meta-item__value">{game.releaseYear}</span>
            </div>
            {game.platform.manufacturer && (
              <div className="meta-item">
                <span className="meta-item__label">Manufacturer</span>
                <span className="meta-item__value">{game.platform.manufacturer}</span>
              </div>
            )}
          </div>

          {game.description && (
            <div className="game-detail__description">
              <h3>About</h3>
              <p>{game.description}</p>
            </div>
          )}

          <div className="game-detail__stats-row">
            <div className="stat-card">
              <div className="stat-card__number">
                {avgRating ? (
                  <><span className="stat-card__rating">{avgRating}</span><span className="stat-card__max">/5</span></>
                ) : (
                  <span className="stat-card__rating">—</span>
                )}
              </div>
              <span className="stat-card__label">Avg Rating</span>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">
                <span className="stat-card__rating">{game._count?.collections || 0}</span>
              </div>
              <span className="stat-card__label">In Collections</span>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">
                <span className="stat-card__rating">{game._count?.wishlists || 0}</span>
              </div>
              <span className="stat-card__label">Wishlisted</span>
            </div>
            <div className="stat-card">
              <div className="stat-card__number">
                <span className="stat-card__rating">{game._count?.reviews || 0}</span>
              </div>
              <span className="stat-card__label">Reviews</span>
            </div>
          </div>

          <div className="game-detail__actions">
            <Button variant="primary">Add to Collection</Button>
            <Button variant="outline">Add to Wishlist</Button>
          </div>

          {game.reviews && game.reviews.length > 0 && (
            <div className="game-detail__reviews">
              <h3 className="game-detail__section-title">
                Recent Reviews ({game._count?.reviews || 0})
              </h3>
              <div className="reviews-list">
                {game.reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card__header">
                      <div className="review-card__user">
                        <span className="review-card__avatar">
                          {review.user.avatarUrl ? (
                            <img src={review.user.avatarUrl} alt="" />
                          ) : (
                            <span className="review-card__avatar-placeholder">
                              {(review.user.displayName || review.user.username).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                        <span className="review-card__username">
                          {review.user.displayName || review.user.username}
                        </span>
                      </div>
                      <Badge variant="highlight">{review.rating}★</Badge>
                    </div>
                    {review.title && <h4 className="review-card__title">{review.title}</h4>}
                    {review.body && <p className="review-card__body">{review.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
