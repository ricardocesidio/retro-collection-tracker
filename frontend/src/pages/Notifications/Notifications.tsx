import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { notificationsApi } from '../../services/social';
import type { NotificationEntry } from '../../services/social';

const Notifications: React.FC = () => {
  const [items, setItems] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.list().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setItems((p) => p.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const getIcon = (t: string) => ({ NEW_FOLLOWER: '👤', NEW_REVIEW: '⭐', WISHLIST_AVAILABLE: '📌', SYSTEM: '🔔' } as any)[t] || '📢';

  return (
    <div className="page-shell" style={{ maxWidth: 720 }}>
      <div className="page-shell__header">
        <div><h1 className="page-shell__title">Notifications</h1><p className="page-shell__sub">{items.filter((n) => !n.isRead).length} unread</p></div>
        <Button variant="ghost" size="sm" onClick={() => { notificationsApi.markAllAsRead(); setItems((p) => p.map((n) => ({ ...n, isRead: true }))); }}>Mark all read</Button>
      </div>
      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((n) => (
            <div key={n.id} className={`dash-panel${!n.isRead ? ' dash-panel--unread' : ''}`} style={{ padding: '0.75rem 1rem', cursor: 'pointer' }} onClick={() => markRead(n.id)}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>{getIcon(n.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.875rem' }}>{n.title}</strong>
                    <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  {n.body && <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>{n.body}</p>}
                  {n.link && <Link to={n.link} style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.25rem', display: 'inline-block' }}>View →</Link>}
                </div>
                {!n.isRead && <span style={{ width: 8, height: 8, background: '#8b5cf6', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
