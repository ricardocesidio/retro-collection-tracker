import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Modal from '../../components/ui/Modal/Modal';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { gamesApi, collectionApi } from '../../services/collections';
import { wishlistApi, reviewsApi } from '../../services/social';
import { useAuth } from '../../context/AuthContext';
import type { GameData } from '../../services/collections';
import type { ReviewEntry } from '../../services/social';
import './GameDetails.scss';

interface GameWithReviews extends GameData {
  avgRating?: number | null;
  reviews?: ReviewEntry[];
}

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state: authState } = useAuth();
  const [game, setGame] = useState<GameWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [addingToCollection, setAddingToCollection] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      gamesApi.getById(id),
      reviewsApi.getByGame(id).then((r) => (cancelled ? null : r)).catch(() => null),
    ]).then(([data, reviewsRes]) => {
      if (!cancelled) {
        setGame(data as GameWithReviews);
        if (reviewsRes) setReviews(reviewsRes.data);
        setLoading(false);
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err.message || 'Game not found');
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [id]);

  const handleAddToCollection = async () => {
    if (!id || !authState.user) return;
    setAddingToCollection(true);
    setActionError('');
    try {
      await collectionApi.create({ gameId: id });
      setGame((prev) => prev ? { ...prev, _count: { ...prev._count!, collections: (prev._count?.collections || 0) + 1 } } : prev);
    } catch (err: any) {
      setActionError(err.message);
    } finally { setAddingToCollection(false); }
  };

  const handleAddToWishlist = async () => {
    if (!id || !authState.user) return;
    setAddingToWishlist(true);
    setActionError('');
    try {
      await wishlistApi.add(id);
      setGame((prev) => prev ? { ...prev, _count: { ...prev._count!, wishlists: (prev._count?.wishlists || 0) + 1 } } : prev);
    } catch (err: any) {
      setActionError(err.message);
    } finally { setAddingToWishlist(false); }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setReviewLoading(true);
    try {
      const review = await reviewsApi.create(id, reviewForm.rating, reviewForm.title || undefined, reviewForm.body || undefined);
      setReviews([review, ...reviews]);
      setGame((prev) => prev ? { ...prev, _count: { ...prev._count!, reviews: (prev._count?.reviews || 0) + 1 } } : prev);
      setReviewOpen(false);
      setReviewForm({ rating: 5, title: '', body: '' });
    } catch (err: any) {
      setActionError(err.message);
    } finally { setReviewLoading(false); }
  };

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
      <Link to="/explore" className="game-detail__back">← Back to Catalog</Link>

      {actionError && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{actionError}</Alert></div>}

      <div className="game-detail">
        <div className="game-detail__image">
          <div className="game-detail__image-wrapper">
            <img src={game.coverImageUrl || `https://placehold.co/600x800/1a1a30/e0e0e0?text=${encodeURIComponent(game.title)}`} alt={game.title} />
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
            {[
              ['Developer', game.developer],
              ['Publisher', game.publisher],
              ['Platform', game.platform.name],
              ['Genre', game.genre.name],
              ['Release Year', String(game.releaseYear)],
              game.platform.manufacturer ? ['Manufacturer', game.platform.manufacturer] : null,
            ].filter(Boolean).map((item) => item && (
              <div key={item[0]} className="meta-item">
                <span className="meta-item__label">{item[0]}</span>
                <span className="meta-item__value">{item[1]}</span>
              </div>
            ))}
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
                {avgRating ? <><span className="stat-card__rating">{avgRating}</span><span className="stat-card__max">/5</span></> : <span className="stat-card__rating">—</span>}
              </div>
              <span className="stat-card__label">Avg Rating</span>
            </div>
            <div className="stat-card"><div className="stat-card__number"><span className="stat-card__rating">{game._count?.collections || 0}</span></div><span className="stat-card__label">In Collections</span></div>
            <div className="stat-card"><div className="stat-card__number"><span className="stat-card__rating">{game._count?.wishlists || 0}</span></div><span className="stat-card__label">Wishlisted</span></div>
            <div className="stat-card"><div className="stat-card__number"><span className="stat-card__rating">{game._count?.reviews || 0}</span></div><span className="stat-card__label">Reviews</span></div>
          </div>

          {authState.user && (
            <div className="game-detail__actions">
              <Button variant="primary" onClick={handleAddToCollection} loading={addingToCollection}>Add to Collection</Button>
              <Button variant="outline" onClick={handleAddToWishlist} loading={addingToWishlist}>Add to Wishlist</Button>
              <Button variant="ghost" onClick={() => setReviewOpen(true)}>Write Review</Button>
            </div>
          )}

          <div className="game-detail__reviews">
            <div className="game-detail__review-header">
              <h3 className="game-detail__section-title">Reviews ({game._count?.reviews || 0})</h3>
              {authState.user && (
                <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>+ Write Review</Button>
              )}
            </div>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card__header">
                      <div className="review-card__user">
                        <span className="review-card__avatar-placeholder">
                          {(review.user.displayName || review.user.username).charAt(0).toUpperCase()}
                        </span>
                        <Link to={`/profile/${review.user.username}`} className="review-card__username">
                          {review.user.displayName || review.user.username}
                        </Link>
                      </div>
                      <Badge variant="highlight">{review.rating}★</Badge>
                    </div>
                    {review.title && <h4 className="review-card__title">{review.title}</h4>}
                    {review.body && <p className="review-card__body">{review.body}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>

      <Modal open={reviewOpen} onClose={() => { setReviewOpen(false); setActionError(''); }} title="Write a Review">
        <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {actionError && <Alert variant="danger">{actionError}</Alert>}
          <div className="input-group">
            <label className="input-group__label">Rating</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                  style={{
                    fontSize: '1.5rem', background: reviewForm.rating >= n ? '#e94560' : 'transparent',
                    border: `2px solid ${reviewForm.rating >= n ? '#e94560' : '#3a3a5a'}`, borderRadius: '4px',
                    padding: '0.25rem 0.5rem', cursor: 'pointer', color: reviewForm.rating >= n ? '#fff' : '#6b6b80',
                  }}
                >★</button>
              ))}
            </div>
          </div>
          <Input label="Title (optional)" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Sum up your thoughts" />
          <Input label="Review" type="textarea" value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })} placeholder="Share your experience with this game..." rows={4} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button variant="ghost" onClick={() => { setReviewOpen(false); setActionError(''); }}>Cancel</Button>
            <Button type="submit" variant="primary" loading={reviewLoading}>Submit Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GameDetails;
