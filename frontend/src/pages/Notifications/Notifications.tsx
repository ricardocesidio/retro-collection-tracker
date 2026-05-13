import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { notificationsApi } from '../../services/social';
import type { NotificationEntry } from '../../services/social';
import './Notifications.scss';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const [res, count] = await Promise.all([
        notificationsApi.list(),
        notificationsApi.getUnreadCount(),
      ]);
      setNotifications(res.data);
      setUnreadCount(count.count);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_FOLLOWER': return '👤';
      case 'NEW_REVIEW': return '⭐';
      case 'WISHLIST_AVAILABLE': return '📌';
      case 'COLLECTION_UPDATE': return '🎮';
      case 'SYSTEM': return '🔔';
      default: return '📢';
    }
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="page-container">
      <div className="notif-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications yet"
          message="When someone follows you, reviews a game, or adds to their wishlist, you'll see it here."
        />
      ) : (
        <div className="notif-list">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-card${!notif.isRead ? ' notif-card--unread' : ''}`}
              onClick={() => !notif.isRead && handleMarkRead(notif.id)}
            >
              <span className="notif-card__icon">{getIcon(notif.type)}</span>
              <div className="notif-card__content">
                <div className="notif-card__header">
                  <strong className="notif-card__title">{notif.title}</strong>
                  <span className="notif-card__time">{getTimeAgo(notif.createdAt)}</span>
                </div>
                {notif.body && <p className="notif-card__body">{notif.body}</p>}
                {notif.link && (
                  <Link to={notif.link} className="notif-card__link">
                    View →
                  </Link>
                )}
              </div>
              {!notif.isRead && <span className="notif-card__dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
