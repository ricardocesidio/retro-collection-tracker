import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ActivityItem from '../../components/ui/ActivityItem/ActivityItem';
import { followApi } from '../../services/social';

const Activity: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { followApi.getActivity({ limit: '50' }).then((r) => setLogs(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const icons: Record<string, string> = { ADDED_GAME: 'fa-solid fa-plus', ADDED_REVIEW: 'fa-solid fa-star', ADDED_WISHLIST: 'fa-solid fa-bookmark', CREATED_ACCOUNT: 'fa-solid fa-user-plus', FOLLOWED_USER: 'fa-solid fa-user-plus' };
  const bg: Record<string, string> = { ADDED_GAME: '#059669', ADDED_REVIEW: '#d97706', ADDED_WISHLIST: '#3b82f6', CREATED_ACCOUNT: '#7c3aed', FOLLOWED_USER: '#ec4899' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Your recent actions</p>
      {logs.length === 0 ? <EmptyState icon="📋" title="No activity yet" message="Your actions will appear here." /> : (
        <div className="panel">
          {logs.map((log: any) => (
            <ActivityItem
              key={log.id}
              icon={icons[log.type] || 'fa-solid fa-bookmark'}
              iconBg={bg[log.type] || '#6366f1'}
              message={log.message || log.type.replace('_', ' ')}
              timestamp={new Date(log.createdAt).toLocaleDateString()}
              onClick={log.targetType === 'Game' && log.targetId ? () => navigate(`/games/${log.targetId}`) : log.targetType === 'User' && log.metadata?.username ? () => navigate(`/profile/${log.metadata.username}`) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;
