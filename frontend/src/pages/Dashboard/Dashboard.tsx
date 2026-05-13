import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard/StatCard';
import { collectionApi } from '../../services/collections';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Dashboard.scss';

interface DashboardData {
  summary: { totalGames: number; totalValue: number; avgRating: number | null; wishlistCount: number };
  platformDistribution: Array<{ id: string; name: string; count: number; percentage: number }>;
  genreDistribution: Array<{ id: string; name: string; count: number; percentage: number }>;
  conditionDistribution: Array<{ condition: string; count: number; percentage: number }>;
  recentAdditions: Array<{ id: string; gameId: string; title: string; platform: string; coverImageUrl?: string; condition: string; personalRating?: number; estimatedValue?: number }>;
  recentReviews: Array<{ id: string; gameId: string; gameTitle: string; platform: string; rating: number; title?: string; body?: string; createdAt: string }>;
  recentActivity: Array<{ id: string; type: string; message?: string; createdAt: string }>;
  wishlistSpotlight: Array<{ id: string; gameId: string; title: string; platform: string; genre: string; priority: number; coverImageUrl?: string }>;
  highlights: { mostValuable: any; highestRated: any };
}

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    collectionApi.getStats().then((d) => { if (!cancelled) setData(d); }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!data || data.summary.totalGames === 0) {
    return (
      <div className="dash-empty">
        <h1>Welcome, {authState.user?.displayName || authState.user?.username || 'Collector'}!</h1>
        <p>Start building your collection to unlock analytics and insights.</p>
        <Link to="/explore" className="dash-empty__cta">Browse Catalog</Link>
      </div>
    );
  }

  const fmt = (v: number) => '$' + v.toLocaleString();
  const { summary, platformDistribution, genreDistribution, recentAdditions, recentReviews, recentActivity, wishlistSpotlight } = data;

  const platformColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#ef4444', '#6366f1'];
  const activityIcons: Record<string, string> = { ADDED_GAME: '➕', ADDED_REVIEW: '⭐', ADDED_WISHLIST: '📌', CREATED_ACCOUNT: '🎉', FOLLOWED_USER: '👤' };

  return (
    <div className="dashboard-full">
      {/* Hero Header */}
      <div className="dash-hero">
        <h1 className="dash-hero__title">Welcome back, {authState.user?.displayName || authState.user?.username || 'Collector'}!</h1>
        <p className="dash-hero__subtitle">Here's your collection overview</p>
      </div>

      {/* KPI Cards */}
      <div className="dash-kpis">
        <StatCard icon="🎮" value={String(summary.totalGames)} label="Total Games" accent="purple" trend="+3 this month" />
        <StatCard icon="💎" value={fmt(summary.totalValue)} label="Est. Value" accent="green" />
        <StatCard icon="✅" value={String(summary.totalGames)} label="Completed" accent="blue" trend="100% of collection" />
        <StatCard icon="⭐" value={String(summary.wishlistCount)} label="Wishlist" accent="orange" />
      </div>

      {/* Main Grid: 2-col left + 1-col right */}
      <div className="dash-main-grid">
        <div className="dash-main-left">
          {/* Recently Added */}
          <div className="dash-panel">
            <div className="dash-panel__header">
              <h3>Recently Added</h3>
              <Link to="/collection" className="dash-panel__link">View All →</Link>
            </div>
            <div className="dash-panel__body">
              {recentAdditions.map((g) => (
                <Link to={`/games/${g.gameId}`} key={g.id} className="dash-game-row">
                  <div className="dash-game-row__thumb">
                    <img src={g.coverImageUrl || `https://placehold.co/48x64/161924/e8eaed?text=${encodeURIComponent(g.title.slice(0,2))}`} alt="" />
                  </div>
                  <div className="dash-game-row__info">
                    <span className="dash-game-row__title">{g.title}</span>
                    <span className="dash-game-row__sub">{g.platform} · {g.condition.replace('_', ' ')}</span>
                  </div>
                  {g.estimatedValue != null && <span className="dash-game-row__value">{fmt(g.estimatedValue)}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="dash-panel">
            <div className="dash-panel__header">
              <h3>Recent Reviews</h3>
              <Link to="/collection" className="dash-panel__link">View All →</Link>
            </div>
            <div className="dash-panel__body">
              {recentReviews.length === 0 ? (
                <p className="dash-empty-text">No reviews yet. Start rating your collection!</p>
              ) : (
                recentReviews.map((r) => (
                  <Link to={`/games/${r.gameId}`} key={r.id} className="dash-review-row">
                    <div className="dash-review-row__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <span className="dash-review-row__title">{r.gameTitle}</span>
                    {r.body && <span className="dash-review-row__body">{r.body.slice(0, 80)}{r.body.length > 80 ? '...' : ''}</span>}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Wishlist Spotlight */}
          <div className="dash-panel dash-panel--wide">
            <div className="dash-panel__header">
              <h3>Wishlist Spotlight</h3>
              <Link to="/wishlist" className="dash-panel__link">View All →</Link>
            </div>
            <div className="dash-panel__body dash-wishlist-grid">
              {wishlistSpotlight.length === 0 ? (
                <p className="dash-empty-text">Your wishlist is empty. Browse the catalog to find games!</p>
              ) : (
                wishlistSpotlight.map((w) => (
                  <Link to={`/games/${w.gameId}`} key={w.id} className="dash-wishlist-card">
                    <div className="dash-wishlist-card__img">
                      <img src={w.coverImageUrl || `https://placehold.co/80x100/161924/e8eaed?text=${encodeURIComponent(w.title.slice(0,2))}`} alt="" />
                    </div>
                    <div className="dash-wishlist-card__info">
                      <span className="dash-wishlist-card__title">{w.title}</span>
                      <span className="dash-wishlist-card__sub">{w.platform} · {w.genre}</span>
                      <span className="dash-wishlist-card__priority">Priority {w.priority + 1}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="dash-main-right">
          {/* Platform Distribution Donut */}
          <div className="dash-panel">
            <h3 className="dash-panel__title-simple">Platform Distribution</h3>
            <div className="dash-donut-section">
              <div
                className="dash-donut"
                style={{
                  background: `conic-gradient(${platformDistribution.map((p, i) => `${platformColors[i % platformColors.length]} ${i === 0 ? 0 : platformDistribution.slice(0, i).reduce((a, b) => a + b.percentage, 0)}% ${platformDistribution.slice(0, i + 1).reduce((a, b) => a + b.percentage, 0)}%`).join(',')})`,
                }}
              >
                <div className="dash-donut__inner">
                  <span className="dash-donut__value">{summary.totalGames}</span>
                  <span className="dash-donut__label">Games</span>
                </div>
              </div>
              <div className="dash-legend">
                {platformDistribution.slice(0, 5).map((p, i) => (
                  <div key={p.name} className="dash-legend__item">
                    <span className="dash-legend__dot" style={{ background: platformColors[i % platformColors.length] }} />
                    <span className="dash-legend__name">{p.name}</span>
                    <span className="dash-legend__count">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dash-panel">
            <div className="dash-panel__header">
              <h3>Activity</h3>
            </div>
            <div className="dash-panel__body">
              {recentActivity.length === 0 ? (
                <p className="dash-empty-text">No recent activity.</p>
              ) : (
                recentActivity.map((a) => (
                  <div key={a.id} className="dash-activity-row">
                    <span className="dash-activity-row__icon">{activityIcons[a.type] || '📌'}</span>
                    <span className="dash-activity-row__msg">{a.message || a.type.replace('_', ' ')}</span>
                    <span className="dash-activity-row__time">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Genres */}
          <div className="dash-panel">
            <h3 className="dash-panel__title-simple">Top Genres</h3>
            <div className="dash-panel__body">
              {genreDistribution.slice(0, 5).map((g) => (
                <div key={g.id} className="dash-bar-row">
                  <div className="dash-bar-row__header">
                    <span>{g.name}</span>
                    <span>{g.count}</span>
                  </div>
                  <div className="dash-bar-row__track">
                    <div className="dash-bar-row__fill" style={{ width: `${Math.min(g.percentage, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
