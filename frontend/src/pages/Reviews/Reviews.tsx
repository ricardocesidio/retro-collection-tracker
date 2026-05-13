import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Badge from '../../components/ui/Badge/Badge';
import { reviewsApi } from '../../services/social';
import type { ReviewEntry } from '../../services/social';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsApi.getByGame('').catch(() => {}); // fallback
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Reviews</h1>
      <p className="page-sub">Community reviews and ratings</p>
      {reviews.length === 0 ? (
        <EmptyState icon="⭐" title="No reviews yet" message="Reviews appear here when games are rated." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {reviews.map((r) => (
            <Link to={`/games/${r.gameId}`} key={r.id} className="panel" style={{ color: 'inherit', textDecoration: 'none', padding: '1rem 1.25rem', transition: 'background 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.user.displayName || r.user.username}</span>
                <Badge variant="highlight">{r.rating} ★</Badge>
              </div>
              {r.title && <p style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>{r.title}</p>}
              {r.body && <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>{r.body}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
