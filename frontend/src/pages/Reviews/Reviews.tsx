import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Badge from '../../components/ui/Badge/Badge';
import { reviewsApi } from '../../services/social';
import { useAuth } from '../../context/AuthContext';
import type { ReviewEntry } from '../../services/social';
import './Reviews.scss';

const Reviews: React.FC = () => {
  const { state: authState } = useAuth();
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.user) { setLoading(false); return; }
    reviewsApi.getByUser(authState.user.id).then(r => setReviews(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [authState.user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Reviews</h1>
      <p className="page-sub">Community reviews and ratings</p>
      {reviews.length === 0 ? (
        <EmptyState icon="⭐" title="No reviews yet" message="Reviews appear here when games are rated." />
      ) : (
        <div className="revs-list">
          {reviews.map((r) => (
            <Link to={`/games/${r.gameId}`} key={r.id} className="panel revs-item">
              <div className="revs-item__header">
                <span className="revs-item__user">{authState.user?.displayName || authState.user?.username || 'You'}</span>
                <Badge variant="highlight">{r.rating} ★</Badge>
              </div>
              {r.title && <p className="revs-item__title">{r.title}</p>}
              {r.body && <p className="revs-item__body">{r.body}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
