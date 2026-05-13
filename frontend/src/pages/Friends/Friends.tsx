import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { followApi } from '../../services/social';
import { useAuth } from '../../context/AuthContext';

const Friends: React.FC = () => {
  const { state: authState } = useAuth();
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tab, setTab] = useState<'followers' | 'following'>('followers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authState.user) { setLoading(false); return; }
    Promise.all([followApi.getFollowers(authState.user.id), followApi.getFollowing(authState.user.id)])
      .then(([f, g]) => { setFollowers(f.data); setFollowing(g.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [authState.user]);

  if (loading) return <LoadingSpinner />;

  const list = tab === 'followers' ? followers : following;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <h1 className="page-title">Friends</h1>
      <p className="page-sub">Your collector network</p>

      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e293b', marginBottom: '1.5rem' }}>
        {(['followers', 'following'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: tab === t ? '#a78bfa' : '#94a3b8', borderBottom: `2px solid ${tab === t ? '#7c3aed' : 'transparent'}`, background: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
            {t === 'followers' ? `Followers (${followers.length})` : `Following (${following.length})`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="👥" title={tab === 'followers' ? 'No followers yet' : 'Not following anyone'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {list.map((f: any) => (
            <Link to={`/profile/${f.username}`} key={f.id} className="panel" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'inherit', textDecoration: 'none', transition: 'background 0.15s' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {(f.displayName || f.username).charAt(0).toUpperCase()}
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600 }}>{f.displayName || f.username}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>@{f.username}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
