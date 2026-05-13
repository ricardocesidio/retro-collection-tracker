import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { followApi } from '../../services/social';

const Activity: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { followApi.getActivity({ limit: '50' }).then((r) => setLogs(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const icons: Record<string, string> = { ADDED_GAME: 'fa-solid fa-plus', ADDED_REVIEW: 'fa-solid fa-star', ADDED_WISHLIST: 'fa-solid fa-bookmark', CREATED_ACCOUNT: 'fa-solid fa-user-plus', FOLLOWED_USER: 'fa-solid fa-user-group' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Your recent actions</p>
      {logs.length === 0 ? <EmptyState icon="📋" title="No activity yet" message="Your actions will appear here." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {logs.map((log: any) => (
            <div key={log.id} className="panel" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '1.125rem' }}>{icons[log.type] || 'fa-solid fa-bookmark'}</span>
              <span style={{ flex: 1, fontSize: '0.875rem' }}>{log.message || log.type.replace('_', ' ')}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(log.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
