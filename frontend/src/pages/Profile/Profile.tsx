import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { usersApi, followApi } from '../../services/social';
import { collectionApi } from '../../services/collections';
import type { UserProfile, ReviewEntry } from '../../services/social';
import type { CollectionEntry } from '../../services/collections';
import './Profile.scss';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'collection' | 'reviews' | 'followers' | 'following'>('collection');
  const [collection, setCollection] = useState<CollectionEntry[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const data = await usersApi.getByUsername(username);
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    followApi.isFollowing(user.id).then((res) => setIsFollowing(res.isFollowing)).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setTabLoading(true);
    const fetcher = activeTab === 'collection'
      ? collectionApi.list({ limit: '50' }).then((r: any) => setCollection(r.data))
      : Promise.resolve(setCollection([]));
    fetcher.finally(() => setTabLoading(false));
  }, [activeTab, user]);

  const handleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.unfollow(user.id);
        setIsFollowing(false);
      } else {
        await followApi.follow(user.id);
        setIsFollowing(true);
      }
    } catch {
      // ignore
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading profile..." />;

  if (error || !user) {
    return (
      <div className="page-container">
        <EmptyState icon="👤" title="User not found" message="This collector doesn't exist or their profile is private.">
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

  return (
    <div className="page-container">
      <div className="profile__header">
        <div className="profile__avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} />
          ) : (
            <div className="profile__avatar-placeholder">
              {(user.displayName || user.username).charAt(0).toUpperCase()}
            </div>
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
          <div className="profile__actions">
            <Button
              variant={isFollowing ? 'outline' : 'primary'}
              onClick={handleFollow}
              loading={followLoading}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </div>

      <div className="profile__tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`profile__tab${activeTab === t.key ? ' profile__tab--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="profile__tab-content">
        {tabLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : activeTab === 'collection' ? (
          collection.length > 0 ? (
            <div className="profile__grid">
              {collection.map((item) => (
                <Link to={`/games/${item.game.id}`} key={item.id}>
                  <Card
                    imageUrl={item.game.coverImageUrl || `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(item.game.title)}`}
                    badge={item.condition.replace('_', ' ')}
                    clickable
                  >
                    <h3 className="game-card__title">{item.game.title}</h3>
                    <div className="game-card__meta">
                      <Badge variant="info">{item.game.platform.name}</Badge>
                      {item.personalRating && <Badge variant="highlight">{item.personalRating}★</Badge>}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState icon="🎮" title="No games yet" message="This collector hasn't added any games yet." />
          )
        ) : activeTab === 'reviews' ? (
          <EmptyState icon="⭐" title="Reviews coming soon" message="Review browsing will be available shortly." />
        ) : activeTab === 'followers' ? (
          <EmptyState icon="👥" title="Followers" message="Social features are being built." />
        ) : (
          <EmptyState icon="👥" title="Following" message="Social features are being built." />
        )}
      </div>
    </div>
  );
};

export default Profile;
