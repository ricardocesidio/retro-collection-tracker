import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { collectionApi } from '../../services/collections';
import { followApi } from '../../services/social';
import './Dashboard.scss';

interface DashboardStats {
  summary: { totalGames: number; totalValue: number; avgRating: number | null };
  platformDistribution: Array<{ id: string; name: string; count: number; percentage: number }>;
  genreDistribution: Array<{ id: string; name: string; count: number; percentage: number }>;
  conditionDistribution: Array<{ condition: string; count: number; percentage: number }>;
  recentAdditions: Array<{ id: string; gameId: string; title: string; platform: string; coverImageUrl?: string; condition: string; personalRating?: number; estimatedValue?: number; addedAt: string }>;
  highlights: {
    mostValuable: { id: string; gameId: string; title: string; platform: string; coverImageUrl?: string; value?: number } | null;
    highestRated: { id: string; gameId: string; title: string; platform: string; coverImageUrl?: string; rating?: number } | null;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      collectionApi.getStats(),
      followApi.getActivity({ limit: '5' }),
    ]).then(([s, a]) => {
      if (!cancelled) {
        setStats(s);
        setActivity(a.data);
      }
    }).catch((err: any) => {
      if (!cancelled) setError(err.message);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Crunching your collection stats..." />;

  if (error && !stats) {
    return (
      <div className="page-container">
        <EmptyState icon="📊" title="Stats unavailable" message="Could not load your collection data.">
          <Link to="/collection"><Button variant="primary">View Collection</Button></Link>
        </EmptyState>
      </div>
    );
  }

  if (!stats || stats.summary.totalGames === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <EmptyState icon="📊" title="Start your collection" message="Add games to your collection to unlock stats, charts, and analytics.">
          <Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link>
          <Link to="/add-game"><Button variant="outline">Add Game</Button></Link>
        </EmptyState>
      </div>
    );
  }

  const { summary, platformDistribution, conditionDistribution, recentAdditions, highlights } = stats;

  const formatCurrency = (val: number) => '$' + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="page-container">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your collection at a glance</p>
        </div>
        <div className="dash-header__actions">
          <Link to="/add-game"><Button variant="primary" size="sm">+ Add Game</Button></Link>
          <Link to="/explore"><Button variant="outline" size="sm">Explore</Button></Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dash-summary">
        <div className="dash-card dash-card--accent">
          <span className="dash-card__icon">🎮</span>
          <span className="dash-card__value">{summary.totalGames}</span>
          <span className="dash-card__label">Total Games</span>
        </div>
        <div className="dash-card dash-card--success">
          <span className="dash-card__icon">💎</span>
          <span className="dash-card__value">{formatCurrency(summary.totalValue)}</span>
          <span className="dash-card__label">Est. Collection Value</span>
        </div>
        <div className="dash-card dash-card--highlight">
          <span className="dash-card__icon">⭐</span>
          <span className="dash-card__value">{summary.avgRating ?? '—'}</span>
          <span className="dash-card__label">Avg Personal Rating</span>
        </div>
        <div className="dash-card">
          <span className="dash-card__icon">🕹️</span>
          <span className="dash-card__value">{platformDistribution.length}</span>
          <span className="dash-card__label">Platforms Collected</span>
        </div>
      </div>

      <div className="dash-grid">
        {/* Platform Distribution */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Platform Distribution</h3>
          <div className="dash-bars">
            {platformDistribution.map((p) => (
              <div key={p.id} className="dash-bar">
                <div className="dash-bar__header">
                  <span className="dash-bar__label">{p.name}</span>
                  <span className="dash-bar__count">{p.count} ({p.percentage}%)</span>
                </div>
                <div className="dash-bar__track">
                  <div className="dash-bar__fill" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Highlights</h3>
          <div className="dash-highlights">
            {highlights.mostValuable && (
              <div className="dash-highlight">
                <span className="dash-highlight__label">Most Valuable</span>
                <div className="dash-highlight__game">
                  <span className="dash-highlight__title">{highlights.mostValuable.title}</span>
                  <span className="dash-highlight__platform">{highlights.mostValuable.platform}</span>
                </div>
                <span className="dash-highlight__value">{formatCurrency(highlights.mostValuable.value || 0)}</span>
              </div>
            )}
            {highlights.highestRated && (
              <div className="dash-highlight">
                <span className="dash-highlight__label">Highest Rated</span>
                <div className="dash-highlight__game">
                  <span className="dash-highlight__title">{highlights.highestRated.title}</span>
                  <span className="dash-highlight__platform">{highlights.highestRated.platform}</span>
                </div>
                <span className="dash-highlight__value">{highlights.highestRated.rating}★</span>
              </div>
            )}
          </div>
        </div>

        {/* Condition Breakdown */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Condition Breakdown</h3>
          <div className="dash-conditions">
            {conditionDistribution.map((c) => (
              <div key={c.condition} className="dash-condition">
                <span className="dash-condition__label">{c.condition.replace('_', ' ')}</span>
                <div className="dash-condition__bar">
                  <div className="dash-condition__fill" style={{ width: `${c.percentage}%` }} />
                </div>
                <span className="dash-condition__count">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Additions */}
        <div className="dash-panel">
          <h3 className="dash-panel__title">Recent Additions</h3>
          <div className="dash-recent">
            {recentAdditions.map((game) => (
              <Link to={`/games/${game.gameId}`} key={game.id} className="dash-recent__item">
                <div className="dash-recent__image">
                  <img src={game.coverImageUrl || `https://placehold.co/80x100/1a1a30/e0e0e0?text=${encodeURIComponent(game.title.slice(0, 4))}`} alt={game.title} />
                </div>
                <div className="dash-recent__info">
                  <span className="dash-recent__title">{game.title}</span>
                  <div className="dash-recent__meta">
                    <Badge variant="info">{game.platform}</Badge>
                    <Badge variant="default">{game.condition.replace('_', ' ')}</Badge>
                    {game.personalRating && <Badge variant="highlight">{game.personalRating}★</Badge>}
                  </div>
                </div>
                {game.estimatedValue != null && (
                  <span className="dash-recent__value">{formatCurrency(game.estimatedValue)}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {activity.length > 0 && (
        <div className="dash-panel dash-panel--wide">
          <h3 className="dash-panel__title">Activity Log</h3>
          <div className="dash-activity">
            {activity.map((log: any) => (
              <div key={log.id} className="dash-activity__item">
                <span className="dash-activity__type">
                  {log.type === 'ADDED_GAME' ? '➕' : log.type === 'ADDED_REVIEW' ? '⭐' : log.type === 'CREATED_ACCOUNT' ? '🎉' : '📌'}
                </span>
                <span className="dash-activity__message">{log.message}</span>
                <span className="dash-activity__time">
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
