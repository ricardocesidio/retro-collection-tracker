import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { usersApi, followApi, reviewsApi } from '../../services/social';
import { collectionApi } from '../../services/collections';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile, ReviewEntry } from '../../services/social';
import type { CollectionEntry } from '../../services/collections';
import './Profile.scss';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { state: authState } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'collection' | 'reviews' | 'followers' | 'following'>('collection');
  const [collection, setCollection] = useState<CollectionEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const data = await usersApi.getByUsername(username);
      setUser(data);
      if (authState.user) {
        followApi.isFollowing(data.id).then((r) => setIsFollowing(r.isFollowing)).catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  }, [username, authState.user]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const fetchTabData = useCallback(async () => {
    if (!user) return;
    setTabLoading(true);
    try {
      if (activeTab === 'collection') {
        const r = await collectionApi.list({ limit: '50' });
        setCollection(r.data);
      } else if (activeTab === 'reviews') {
        const r = await reviewsApi.getByUser(user.id);
        setReviews(r.data);
      } else if (activeTab === 'followers') {
        const r = await followApi.getFollowers(user.id);
        setFollowers(r.data);
      } else if (activeTab === 'following') {
        const r = await followApi.getFollowing(user.id);
        setFollowing(r.data);
      }
    } catch {
      // handle
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => { fetchTabData(); }, [fetchTabData]);

  const handleFollow = async () => {
    if (!user || !authState.user) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.unfollow(user.id);
        setIsFollowing(false);
      } else {
        await followApi.follow(user.id);
        setIsFollowing(true);
      }
    } catch { /* ignore */ } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading profile..." />;

  if (error || !user) {
    return (
      <div className="page-container">
        <EmptyState icon="👤" title="User not found" message="This collector doesn't exist.">
          <Link to="/explore"><Button variant="primary">Explore Catalog</Button></Link>
        </EmptyState>
      </div>
    );
  }

  const stats = [
    { value: user._count.collections, label: 'Games' },
    { value: user._count.wishlists, label: 'Wishlist' },
    { value: user._count.reviews, label: 'Reviews' },
    { value: user._count.followers, label: 'Followers' },
    { value: user._count.following, label: 'Following' },
  ];

  const tabs = [
    { key: 'collection' as const, label: `Collection (${user._count.collections})` },
    { key: 'reviews' as const, label: `Reviews (${user._count.reviews})` },
    { key: 'followers' as const, label: `Followers (${user._count.followers})` },
    { key: 'following' as const, label: `Following (${user._count.following})` },
  ];

  const renderTabContent = () => {
    if (tabLoading) return <LoadingSpinner message="Loading..." />;

    if (activeTab === 'collection') {
      if (collection.length === 0) return <EmptyState icon="🎮" title="No games yet" />;
      return (
        <div className="profile__grid">
          {collection.map((item) => (
            <Link to={`/games/${item.game.id}`} key={item.id}>
              <Card imageUrl={item.game.coverImageUrl || `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(item.game.title)}`} badge={item.condition.replace('_', ' ')} clickable>
                <h3 className="game-card__title">{item.game.title}</h3>
                <div className="game-card__meta">
                  <Badge variant="info">{item.game.platform.name}</Badge>
                  {item.personalRating && <Badge variant="highlight">{item.personalRating}★</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      );
    }

    if (activeTab === 'reviews') {
      if (user._count.reviews === 0) return <EmptyState icon="⭐" title="No reviews yet" />;
      if (reviews.length === 0) return <EmptyState icon="⭐" title={`${user._count.reviews} reviews`} message="Reviews are available on each game's page." />;
      return (
        <div className="profile__reviews">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-card__header">
                <span className="review-card__game">{r.game?.title || 'Game'}</span>
                <Badge variant="highlight">{r.rating}★</Badge>
              </div>
              {r.body && <p className="review-card__body">{r.body}</p>}
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'followers') {
      if (followers.length === 0) return <EmptyState icon="👥" title="No followers yet" />;
      return (
        <div className="profile__followers">
          {followers.map((f: any) => (
            <Link key={f.id} to={`/profile/${f.username}`} className="profile__follower-card">
              <span className="profile__follower-avatar">{(f.displayName || f.username).charAt(0).toUpperCase()}</span>
              <div>
                <span className="profile__follower-name">{f.displayName || f.username}</span>
                <span className="profile__follower-username">@{f.username}</span>
              </div>
            </Link>
          ))}
        </div>
      );
    }

    if (activeTab === 'following') {
      if (following.length === 0) return <EmptyState icon="👥" title="Not following anyone yet" />;
      return (
        <div className="profile__followers">
          {following.map((f: any) => (
            <Link key={f.id} to={`/profile/${f.username}`} className="profile__follower-card">
              <span className="profile__follower-avatar">{(f.displayName || f.username).charAt(0).toUpperCase()}</span>
              <div>
                <span className="profile__follower-name">{f.displayName || f.username}</span>
                <span className="profile__follower-username">@{f.username}</span>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="page-container">
      <div className="profile__header">
        <div className="profile__avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} />
          ) : (
            <div className="profile__avatar-placeholder">{(user.displayName || user.username).charAt(0).toUpperCase()}</div>
          )}
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{user.displayName || user.username}</h1>
          <p className="profile__username">@{user.username}</p>
          {user.bio && <p className="profile__bio">{user.bio}</p>}
          <div className="profile__stats">
            {stats.map((s) => (
              <div key={s.label} className="profile__stat">
                <span className="profile__stat-value">{s.value}</span>
                <span className="profile__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          {authState.user && authState.user.id !== user.id && (
            <div className="profile__actions">
              <Button variant={isFollowing ? 'outline' : 'primary'} onClick={handleFollow} loading={followLoading}>
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="profile__tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`profile__tab${activeTab === t.key ? ' profile__tab--active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="profile__tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Profile;
