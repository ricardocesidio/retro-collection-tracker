import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { apiRequest } from '../../services/api-client';
import './Leaderboard.scss';

interface LeaderboardEntry {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  totalValue: number;
  gameCount: number;
}

const MEDALS = [
  { place: 1, emoji: '🥇', label: 'Gold', color: '#f59e0b', shadow: 'rgba(245,158,11,.3)' },
  { place: 2, emoji: '🥈', label: 'Silver', color: '#94a3b8', shadow: 'rgba(148,163,184,.3)' },
  { place: 3, emoji: '🥉', label: 'Bronze', color: '#d97706', shadow: 'rgba(217,119,6,.3)' },
];

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<LeaderboardEntry[]>('/stats/leaderboard')
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <div className="lb-header">
        <h1 className="page-title">Top Collectors</h1>
        <p className="page-sub">The most valuable collections on Retro Collection Tracker</p>
      </div>

      {users.length === 0 ? (
        <EmptyState icon="🏆" title="No collectors yet" message="Start building your collection to appear on the leaderboard." />
      ) : (
        <div className="lb-list">
          <div className="lb-podium">
            {users.slice(0, 3).map((u, i) => {
              const medal = MEDALS[i];
              return (
                <Link key={u.id} to={`/profile/${u.username}`} className={`lb-podium__card lb-podium__card--${medal.label.toLowerCase()}`} style={{ '--medal-color': medal.color, '--medal-shadow': medal.shadow } as React.CSSProperties}>
                  <div className="lb-podium__medal">{medal.emoji}</div>
                  <div className="lb-podium__avatar">
                    {u.avatarUrl ? <img src={u.avatarUrl} alt="" /> : <span>{u.displayName?.charAt(0) || u.username.charAt(0)}</span>}
                  </div>
                  <div className="lb-podium__name">{u.displayName || u.username}</div>
                  <div className="lb-podium__value">${u.totalValue.toLocaleString()}</div>
                  <div className="lb-podium__games">{u.gameCount} game{u.gameCount !== 1 ? 's' : ''}</div>
                </Link>
              );
            })}
          </div>

          <div className="lb-rest">
            {users.slice(3).map((u, i) => (
              <Link key={u.id} to={`/profile/${u.username}`} className="lb-row">
                <span className="lb-row__rank">#{i + 4}</span>
                <div className="lb-row__avatar">
                  {u.avatarUrl ? <img src={u.avatarUrl} alt="" /> : <span>{u.displayName?.charAt(0) || u.username.charAt(0)}</span>}
                </div>
                <span className="lb-row__name">{u.displayName || u.username}</span>
                <span className="lb-row__games">{u.gameCount} games</span>
                <span className="lb-row__value">${u.totalValue.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
