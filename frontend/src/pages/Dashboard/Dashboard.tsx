import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard/StatCard';
import ActivityItem from '../../components/ui/ActivityItem/ActivityItem';
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
  recentReviews: Array<{ id: string; gameId: string; gameTitle: string; platform: string; coverImageUrl?: string | null; rating: number; title?: string; body?: string; user?: { username: string; displayName?: string; avatarUrl?: string } }>;
  recentActivity: Array<{ id: string; type: string; message?: string; createdAt: string }>;
  wishlistSpotlight: Array<{ id: string; gameId: string; title: string; platform: string; genre: string; priority: number; coverImageUrl?: string }>;
  highlights: { mostValuable: any; highestRated: any };
}

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [valueHistory, setValueHistory] = useState<Array<{month:string;value:number}>>([]);

  useEffect(() => {
    let c = false;
    Promise.all([
      collectionApi.getStats(),
      collectionApi.getValueHistory(),
    ]).then(([d, vh]) => { if (!c) { setData(d); setValueHistory(vh); setTimeout(() => setVisible(true), 50); }}).catch(() => {}).finally(() => { if (!c) setLoading(false); });
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

  const { summary, platformDistribution, genreDistribution, recentReviews, recentActivity, wishlistSpotlight, highlights } = data;
  const fmt = (v: number) => '$' + v.toLocaleString();
  const pColors = ['#7c3aed', '#a78bfa', '#3b82f6', '#d97706', '#f59e0b', '#06b6d4', '#ec4899', '#6366f1'];
  const pColorMap: Record<string, string> = { 'PlayStation': '#7c3aed', 'SNES': '#ec4899', 'NES': '#3b82f6', 'Sega Genesis': '#d97706', 'Nintendo 64': '#f59e0b', 'Game Boy': '#06b6d4', 'Game Boy Advance': '#6366f1', 'Sega Saturn': '#a78bfa', 'Atari 2600': '#f87171', 'PC Engine': '#84cc16', 'Other': '#059669' };
  const platformTop5 = platformDistribution.slice(0, 5);
  const otherPct = platformDistribution.slice(5).reduce((s, p) => s + p.percentage, 0);
  const otherCount = platformDistribution.slice(5).reduce((s, p) => s + p.count, 0);
  const platformSlices = otherPct > 0 ? [...platformTop5, { name: 'Other', count: otherCount, percentage: otherPct }] : platformTop5;
  const genreColors: Record<string, string> = {
    'RPG': 'linear-gradient(90deg, #f59e0b, #d97706)',
    'Action': 'linear-gradient(90deg, #ec4899, #f472b6)',
    'Platformer': 'linear-gradient(90deg, #60a5fa, #93c5fd)',
    'Adventure': 'linear-gradient(90deg, #f87171, #fca5a5)',
    'Fighting': 'linear-gradient(90deg, #3b82f6, #60a5fa)',
    'Shooter': 'linear-gradient(90deg, #6366f1, #818cf8)',
    'Puzzle': 'linear-gradient(90deg, #34d399, #6ee7b7)',
    'Sports': 'linear-gradient(90deg, #fb923c, #fdba74)',
    'Strategy': 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
    'Horror': 'linear-gradient(90deg, #ef4444, #f87171)',
    "Beat 'em Up": 'linear-gradient(90deg, #84cc16, #a3e635)',
    'Other': 'linear-gradient(90deg, #7c3aed, #a78bfa)',
  };
  const genreTop5 = genreDistribution.slice(0, 5);
  const genreOtherPct = genreDistribution.slice(5).reduce((s, g) => s + g.percentage, 0);
  const maxVal = Math.max(...valueHistory.map(v => v.value), 15000);
  const chartH = 160;
  const chartBaseline = 170;
  const chartPoints = valueHistory.map((v, i) => {
    const x = 60 + i * 104;
    const y = chartBaseline - (v.value / maxVal) * chartH;
    return [x, y] as [number, number];
  });
  const areaPoints = [[60, chartBaseline], ...chartPoints, [580, chartBaseline]].map(([x, y]) => `${x},${y}`).join(' ');
  const linePoints = chartPoints.map(([x, y]) => `${x},${y}`).join(' ');
  const yTicks = [0, Math.round(maxVal / 3), Math.round(maxVal * 2 / 3), maxVal];
  const genreSlices = genreOtherPct > 0 ? [...genreTop5, { name: 'Other', percentage: genreOtherPct }] : genreTop5;
  const getPColor = (name: string, i: number): string => pColorMap[name] || pColors[i % 8];
  const aIcons: Record<string, string> = { ADDED_GAME: 'fa-solid fa-plus', ADDED_REVIEW: 'fa-solid fa-star', ADDED_WISHLIST: 'fa-solid fa-bookmark', CREATED_ACCOUNT: 'fa-solid fa-user-plus', FOLLOWED_USER: 'fa-solid fa-user-plus' };
  const aBg: Record<string, string> = { ADDED_GAME: '#059669', ADDED_REVIEW: '#d97706', ADDED_WISHLIST: '#3b82f6', CREATED_ACCOUNT: '#7c3aed', FOLLOWED_USER: '#ec4899' };
  const parseActivity = (type: string, msg: string): { highlight: string; text: string } => {
    if (type === 'ADDED_GAME') { const m = msg.match(/^Added (.+?) to collection$/); return m ? { highlight: m[1], text: 'added to collection' } : { highlight: '', text: msg }; }
    if (type === 'ADDED_REVIEW') { const m = msg.match(/^Reviewed (.+?) — (.+)$/); return m ? { highlight: m[1], text: `reviewed — ${m[2]}` } : { highlight: '', text: msg }; }
    if (type === 'ADDED_WISHLIST') { const m = msg.match(/^Added (.+?) to wishlist$/); return m ? { highlight: m[1], text: 'added to wishlist' } : { highlight: '', text: msg }; }
    if (type === 'FOLLOWED_USER') { const m = msg.match(/^(.+?) started following you$/); return m ? { highlight: m[1], text: 'started following you' } : { highlight: '', text: msg }; }
    if (type === 'CREATED_ACCOUNT') return { highlight: '', text: msg };
    return { highlight: '', text: msg };
  };
  const relTime = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 30) return `${days}d ago`; return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className={`dash${visible ? ' dash--visible' : ''}`}>
      {/* Hero */}
      <section className="dash-hero">
        <div>
          <h1 className="dash-hero__greeting">Welcome back, {authState.user?.displayName || authState.user?.username}</h1>
          <p className="dash-hero__subtitle">Here's your collection overview</p>
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
          {/* Collection Value Over Time */}
          <div className="panel">
            <div className="panel-header">
              <h3>Collection Value Over Time</h3>
              <select className="form-select" style={{ minWidth: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                <option>6 Months</option><option>1 Year</option><option>All Time</option>
              </select>
            </div>
            <div className="dash-value-chart">
              <svg viewBox="0 0 600 200" className="dash-value-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {yTicks.map(v => {
                  const gy = chartBaseline - (v / maxVal) * chartH;
                  return <line key={v} x1="60" y1={gy} x2="580" y2={gy} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
                })}
                {yTicks.map(v => (
                  <text key={v} x="50" y={chartBaseline - (v / maxVal) * chartH + 4} textAnchor="end" fill="#5a6480" fontSize="10" fontFamily="DM Mono, monospace">${v >= 1000 ? Math.round(v / 1000) + 'k' : v}</text>
                ))}
                <polygon fill="url(#areaGrad)" points={areaPoints} />
                <polyline points={linePoints} fill="none" stroke="#d946ef" strokeWidth="2" strokeLinejoin="round" />
                {chartPoints.map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#d946ef" stroke="#0f111a" strokeWidth="1.5" />
                ))}
                {valueHistory.map((v, i) => {
                  const tx = 60 + i * 104;
                  return <g key={i}><line x1={tx} y1={chartBaseline} x2={tx} y2={chartBaseline + 5} stroke="#5a6480" strokeWidth="1" /><text x={tx} y={chartBaseline + 20} textAnchor="middle" fill="#5a6480" fontSize="10" fontFamily="DM Mono, monospace">{v.month}</text></g>;
                })}
              </svg>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="panel">
            <div className="panel-header"><h3>Recent Reviews</h3><Link to="/reviews" className="panel-link">View All</Link></div>
            {recentReviews.length === 0 ? <p style={{ fontSize: '0.8125rem', color: '#5a6480' }}>No reviews yet.</p> : (
              <>
                {recentReviews.slice(0, 3).map((r) => (
                  <Link to={`/games/${r.gameId}`} key={r.id} className="rev-card">
                    <div className="rev-card__img">
                      <img src={r.coverImageUrl || `https://placehold.co/80x56/141829/f0f4ff?text=${encodeURIComponent(r.gameTitle.slice(0, 4))}`} alt="" loading="lazy" />
                    </div>
                    <div className="rev-card__info">
                      <span className="rev-card__title">{r.gameTitle}</span>
                      <span className="rev-card__platform">{r.platform}</span>
                      <span className="rev-card__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      {r.user && <span className="rev-card__user">by {r.user.displayName || r.user.username}</span>}
                    </div>
                    <div className="rev-card__badge">{(r.rating / 5 * 10).toFixed(1)}</div>
                  </Link>
                ))}
              </>
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
              <>
                {recentActivity.slice(0, 4).map((a) => {
                  const parsed = parseActivity(a.type, a.message || a.type.replace('_', ' '));
                  return (
                    <ActivityItem
                      key={a.id}
                      icon={aIcons[a.type] || 'fa-solid fa-bookmark'}
                      iconBg={aBg[a.type] || '#6366f1'}
                      message={parsed.text}
                      highlight={parsed.highlight || undefined}
                      timestamp={relTime(a.createdAt)}
                    />
                  );
                })}
                <Link to="/activity" className="activity-btn">View All Activity</Link>
              </>
            )}
          </div>

          {/* Top Genres */}
          <div className="panel">
            <div className="panel-header"><h3>Top Genres</h3></div>
            <div className="dash-bars">
              {genreSlices.map((g) => (
                <ProgressCard key={g.name} label={g.name} percentage={g.percentage} color={genreColors[g.name] || genreColors.Other} />
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
