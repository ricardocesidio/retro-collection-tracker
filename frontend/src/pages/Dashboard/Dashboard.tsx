import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard/StatCard';
import ActivityItem from '../../components/ui/ActivityItem/ActivityItem';
import ReviewCard from '../../components/ui/ReviewCard/ReviewCard';
import ProgressCard from '../../components/ui/ProgressCard/ProgressCard';
import { collectionApi } from '../../services/collections';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Dashboard.scss';

interface DashboardData {
  summary: { totalGames: number; totalValue: number; avgRating: number | null; wishlistCount: number };
  platformDistribution: Array<{ name: string; count: number; percentage: number }>;
  genreDistribution: Array<{ name: string; count: number; percentage: number }>;
  conditionDistribution: Array<{ condition: string; count: number; percentage: number }>;
  recentAdditions: Array<{ id: string; gameId: string; title: string; platform: string; coverImageUrl?: string; description?: string; condition: string; score?: string | null; estimatedValue?: number }>;
  recentReviews: Array<{ id: string; gameId: string; gameTitle: string; platform: string; rating: number; title?: string; body?: string }>;
  recentActivity: Array<{ id: string; type: string; message?: string; createdAt: string }>;
  wishlistSpotlight: Array<{ id: string; gameId: string; title: string; platform: string; genre: string; priority: number; coverImageUrl?: string }>;
  highlights: { mostValuable: any; highestRated: any };
}

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let c = false;
    collectionApi.getStats().then((d) => { if (!c) { setData(d); setTimeout(() => setVisible(true), 50); }}).catch(() => {}).finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!data || data.summary.totalGames === 0) {
    return (
      <div className="dash-empty">
        <div className="dash-empty__inner">
          <h1>Welcome, {authState.user?.displayName || authState.user?.username || 'Collector'}</h1>
          <p>Start building your collection to unlock powerful analytics.</p>
          <div className="dash-empty__actions">
            <Link to="/explore" className="btn btn--primary btn--lg">Browse Catalog</Link>
            <Link to="/add-game" className="btn btn--outline btn--lg">Add Your First Game</Link>
          </div>
        </div>
      </div>
    );
  }

  const { summary, platformDistribution, genreDistribution, recentAdditions, recentReviews, recentActivity, wishlistSpotlight, highlights } = data;
  const fmt = (v: number) => '$' + v.toLocaleString();
  const pColors = ['#7c3aed', '#a78bfa', '#3b82f6', '#d97706', '#f59e0b', '#06b6d4', '#ec4899', '#6366f1'];
  const pColorMap: Record<string, string> = { 'PlayStation': '#7c3aed', 'SNES': '#ec4899', 'NES': '#3b82f6', 'Sega Genesis': '#d97706', 'Nintendo 64': '#f59e0b', 'Game Boy': '#06b6d4', 'Game Boy Advance': '#6366f1', 'Sega Saturn': '#a78bfa', 'Atari 2600': '#f87171', 'PC Engine': '#84cc16', 'Other': '#059669' };
  const platformTop5 = platformDistribution.slice(0, 5);
  const otherPct = platformDistribution.slice(5).reduce((s, p) => s + p.percentage, 0);
  const otherCount = platformDistribution.slice(5).reduce((s, p) => s + p.count, 0);
  const platformSlices = otherPct > 0 ? [...platformTop5, { name: 'Other', count: otherCount, percentage: otherPct }] : platformTop5;
  const getPColor = (name: string, i: number): string => pColorMap[name] || pColors[i % 8];
  const aIcons: Record<string, string> = { ADDED_GAME: 'fa-solid fa-plus', ADDED_REVIEW: 'fa-solid fa-star', ADDED_WISHLIST: 'fa-solid fa-bookmark', CREATED_ACCOUNT: 'fa-solid fa-user-plus' };

  return (
    <div className={`dash${visible ? ' dash--visible' : ''}`}>
      {/* Hero */}
      <section className="dash-hero">
        <div>
          <h1 className="dash-hero__greeting">Welcome back, {authState.user?.displayName || authState.user?.username}</h1>
          <p className="dash-hero__subtitle">Here's your collection overview</p>
        </div>
        <div className="dash-hero__quick-stats">
          <div className="dash-hero__stat"><span className="dash-hero__stat-value">{summary.totalGames}</span><span className="dash-hero__stat-label">Games</span></div>
          <div className="dash-hero__stat"><span className="dash-hero__stat-value">{fmt(summary.totalValue)}</span><span className="dash-hero__stat-label">Value</span></div>
          <div className="dash-hero__stat"><span className="dash-hero__stat-value">{platformDistribution.length}</span><span className="dash-hero__stat-label">Platforms</span></div>
        </div>
      </section>

      {/* KPI Row */}
      <div className="dash-kpis">
        <StatCard icon="fa-solid fa-gamepad" value={String(summary.totalGames)} label="Total Games" accent="purple" />
        <StatCard icon="fa-solid fa-dollar-sign" value={fmt(summary.totalValue)} label="Est. Value" accent="blue" />
        <StatCard icon="fa-solid fa-trophy" value={String(summary.totalGames)} label="Completed" accent="green" />
        <StatCard icon="fa-solid fa-star" value={String(summary.wishlistCount)} label="Wishlist" accent="amber" />
      </div>

      {/* Main Grid */}
      <div className="dash-grid">
        <div className="dash-col">
          {/* Recently Added */}
          <div className="panel">
            <div className="panel-header"><h3>Recently Added</h3><Link to="/collection" className="panel-link">View All</Link></div>
            <div className="ra-grid">
              {recentAdditions.slice(0, 4).map((g) => (
                <Link to={`/games/${g.gameId}`} key={g.id} className="ra-card">
                  <div className="ra-card__img">
                    <img src={g.coverImageUrl || `https://placehold.co/400x240/181d30/f0f4ff?text=${encodeURIComponent(g.title.slice(0,8))}`} alt="" loading="lazy" />
                  </div>
                  <div className="ra-card__body">
                    <div className="ra-card__text">
                      <span className="ra-card__title">{g.title}</span>
                      <span className="ra-card__platform">{g.platform}</span>
                    </div>
                    <div className="ra-card__score">{g.score || '—'}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Collection Value Over Time */}
          <div className="panel">
            <div className="panel-header">
              <h3>Collection Value Over Time</h3>
              <select className="form-select" style={{ minWidth: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                <option>6 Months</option><option>1 Year</option><option>All Time</option>
              </select>
            </div>
            <div className="dash-value-chart">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '120px', padding: '0.5rem 0' }}>
                {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => {
                  const h = 20 + Math.random() * 80;
                  return (
                    <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.625rem', fontFamily: 'DM Mono', color: '#5a6480' }}>{fmt(Math.round(summary.totalValue * (0.7 + i * 0.06)))}</span>
                      <div style={{ width: '100%', height: `${h}px`, background: 'linear-gradient(180deg, #7c3aed, rgba(124,58,237,0.1))', borderRadius: '4px 4px 0 0', minWidth: '20px' }} />
                      <span style={{ fontSize: '0.625rem', color: '#5a6480', fontFamily: 'DM Mono' }}>{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="panel">
            <div className="panel-header"><h3>Recent Reviews</h3><Link to="/reviews" className="panel-link">View All</Link></div>
            {recentReviews.length === 0 ? <p style={{ fontSize: '0.8125rem', color: '#5a6480' }}>No reviews yet.</p> : (
              recentReviews.map((r) => <ReviewCard key={r.id} rating={r.rating} title={r.title || 'Untitled'} body={r.body} gameTitle={r.gameTitle} platform={r.platform} />)
            )}
          </div>
        </div>

        <div className="dash-col">
          {/* Collection by Platform */}
          <div className="panel panel--platform">
            <div className="panel-header"><h3>Collection by Platform</h3></div>
            <div className="dash-platform-body">
              <div className="dash-platform-chart">
                <div className="dash-donut" style={{ background: `conic-gradient(${platformSlices.map((p, i) => `${getPColor(p.name, i)} ${i === 0 ? 0 : platformSlices.slice(0, i).reduce((a, b) => a + b.percentage, 0)}% ${platformSlices.slice(0, i + 1).reduce((a, b) => a + b.percentage, 0)}%`).join(',')})` }}>
                  <div className="dash-donut__center">
                    <span className="dash-donut__center-value">{summary.totalGames}</span>
                    <span className="dash-donut__center-label">Total</span>
                  </div>
                </div>
              </div>
              <div className="dash-platform-legend">
                {platformSlices.map((p, i) => (
                  <Link to={p.name === 'Other' ? '/collection' : `/explore?platform=${encodeURIComponent(p.name)}`} key={p.name} className="dash-platform-legend__row">
                    <span className="dash-platform-legend__dot" style={{ background: getPColor(p.name, i) }} />
                    <span className="dash-platform-legend__name">{p.name}</span>
                    <span className="dash-platform-legend__pct">{p.percentage}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="panel">
            <div className="panel-header"><h3>Recent Activity</h3></div>
            {recentActivity.length === 0 ? <p style={{ fontSize: '0.8125rem', color: '#5a6480' }}>No activity yet.</p> : (
              recentActivity.map((a) => <ActivityItem key={a.id} icon={aIcons[a.type] || "fa-solid fa-bookmark"} message={a.message || a.type.replace('_', ' ')} timestamp={new Date(a.createdAt).toLocaleDateString()} />)
            )}
          </div>

          {/* Top Genres */}
          <div className="panel">
            <div className="panel-header"><h3>Top Genres</h3></div>
            <div className="dash-bars">
              {genreDistribution.slice(0, 5).map((g) => (
                <ProgressCard key={g.name} label={g.name} value={g.count} max={summary.totalGames} color={pColors[genreDistribution.indexOf(g) % 8]} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Spotlight */}
      {wishlistSpotlight.length > 0 && (
        <div className="panel" style={{ marginTop: '1rem' }}>
          <div className="panel-header"><h3>Wishlist Spotlight</h3><Link to="/wishlist" className="panel-link">View All</Link></div>
          <div className="dash-wishlist-strip">
            {wishlistSpotlight.map((w) => (
              <Link to={`/games/${w.gameId}`} key={w.id} className="dash-wish-item">
                <div className="dash-wish-item__img"><img src={w.coverImageUrl || `https://placehold.co/80x100/141829/f0f4ff?text=${encodeURIComponent(w.title.slice(0,3))}`} alt="" loading="lazy" /></div>
                <div className="dash-wish-item__body"><span className="dash-wish-item__title">{w.title}</span><span className="dash-wish-item__meta">{w.platform} · {w.genre}</span><span className="dash-wish-item__priority">P{w.priority + 1}</span></div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
