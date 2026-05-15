import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { usersApi, followApi, reviewsApi } from '../../services/social';
import { collectionApi } from '../../services/collections';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile, ReviewEntry } from '../../services/social';
import type { CollectionEntry } from '../../services/collections';
import './Profile.scss';

const Profile: React.FC = () => {
  const { username } = useParams<{username:string}>();
  const { state: authState } = useAuth();
  const [user, setUser] = useState<UserProfile|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'collection'|'reviews'|'followers'|'following'>('collection');
  const [collection, setCollection] = useState<CollectionEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!username) return; setLoading(true);
    try { const d = await usersApi.getByUsername(username); setUser(d); if(authState.user) followApi.isFollowing(d.id).then((r)=>setIsFollowing(r.isFollowing)).catch(()=>{}); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [username, authState.user]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const fetchTab = useCallback(async () => {
    if (!user) return; setTabLoading(true);
    try {
      if (tab==='collection') { const r = await collectionApi.getPublicCollection(user.id, {limit:'50'}); setCollection(r.data); }
      else if (tab==='reviews') { const r = await reviewsApi.getByUser(user.id); setReviews(r.data); }
      else if (tab==='followers') { const r = await followApi.getFollowers(user.id); setFollowers(r.data); }
      else if (tab==='following') { const r = await followApi.getFollowing(user.id); setFollowing(r.data); }
    } catch {} finally { setTabLoading(false); }
  }, [tab, user]);

  useEffect(() => { fetchTab(); }, [fetchTab]);

  const handleFollow = async () => {
    if (!user || !authState.user) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followApi.unfollow(user.id);
        setIsFollowing(false);
        setUser((prev) => prev ? { ...prev, _count: { ...prev._count, followers: Math.max(0, prev._count.followers - 1) } } : null);
      } else {
        await followApi.follow(user.id);
        setIsFollowing(true);
        setUser((prev) => prev ? { ...prev, _count: { ...prev._count, followers: prev._count.followers + 1 } } : null);
      }
    } catch {} finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error||!user) return <div className="page-shell"><EmptyState icon="👤" title="User not found"/></div>;

  const stats = [
    {v:user._count.collections,l:'Games'},
    {v:user._count.wishlists,l:'Wishlist'},
    {v:user._count.reviews,l:'Reviews'},
    {v:user._count.followers,l:'Followers'},
    {v:user._count.following,l:'Following'},
  ];

  return (
    <div className="page-shell">
      <div className="prof-hero">
        <div className="prof-hero__avatar">
          {user.avatarUrl ? <img src={user.avatarUrl} alt=""/> : <div className="prof-hero__avatar-placeholder">{(user.displayName||user.username).charAt(0).toUpperCase()}</div>}
        </div>
        <div className="prof-hero__info">
          <h1 className="prof-hero__name">{user.displayName||user.username}</h1>
          <p className="prof-hero__handle">@{user.username}</p>
          {user.bio && <p className="prof-hero__bio">{user.bio}</p>}
          <div className="prof-hero__stats">
            {stats.map((s) => (
              <div key={s.l} className="prof-stat">
                <span className="prof-stat__v">{s.v}</span>
                <span className="prof-stat__l">{s.l}</span>
              </div>
            ))}
          </div>
          {authState.user && authState.user.id !== user.id && (
            <Button variant={isFollowing?'outline':'primary'} onClick={handleFollow} loading={followLoading}>
              {isFollowing?'Following':'Follow'}
            </Button>
          )}

          <div className="prof-level-card">
            <div className="prof-level-card__badge">{Math.min(99, user._count.collections * 2)}</div>
            <div className="prof-level-card__info">
              <span className="prof-level-card__label">Collector Level</span>
              <div className="prof-level-card__bar">
                <div className="prof-level-card__fill" style={{ width: `${Math.min(100, user._count.collections * 2)}%` }} />
              </div>
              <span className="prof-level-card__sub">{user._count.collections} games collected · {user._count.collections * 2}/100 XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="prof-tabs">
        {(['collection','reviews','followers','following'] as const).map((t) => (
          <button key={t} className={`prof-tab${tab===t?' prof-tab--active':''}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      <div className="prof-content">
        {tabLoading ? <LoadingSpinner/> : tab==='collection' ? (
          collection.length===0 ? <EmptyState icon="🎮" title="No games yet"/> : (
            <div className="page-grid">
              {collection.map((item) => (
                <Link to={`/games/${item.game.id}`} key={item.id} style={{textDecoration:'none',color:'inherit'}}>
                  <div className="game-card-new">
                    <div className="game-card-new__img">
                      <img src={item.game.coverImageUrl||`https://placehold.co/400x300/181c28/f1f5f9?text=${encodeURIComponent(item.game.title.slice(0,6))}`} alt="" loading="lazy"/>
                      <span className="game-card-new__condition">{item.condition.replace('_',' ')}</span>
                    </div>
                    <div className="game-card-new__body">
                      <h3 className="game-card-new__title">{item.game.title}</h3>
                      <p className="game-card-new__meta">{item.game.platform.name} · {item.game.genre.name}</p>
                      {item.personalRating && <span className="game-card-new__rating">★ {item.personalRating}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : tab==='reviews' ? (
          reviews.length===0 ? <EmptyState icon="⭐" title="No reviews yet"/> : (
            <div className="prof-reviews">
              {reviews.map((r) => (
                <Link to={`/games/${r.gameId}`} key={r.id} className="prof-review-item">
                  <div className="prof-review-item__user">
                    <div className="prof-review-item__avatar">{user.displayName?.charAt(0) || user.username.charAt(0)}</div>
                    <span className="prof-review-item__username">{user.displayName || user.username}</span>
                  </div>
                  <div className="prof-review-item__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <span className="prof-review-item__title">{r.title||'Untitled'}</span>
                  {r.body && <p className="prof-review-item__body">{r.body.slice(0,120)}{r.body.length>120?'...':''}</p>}
                </Link>
              ))}
            </div>
          )
        ) : tab==='followers' ? (
          followers.length===0 ? <EmptyState icon="👥" title="No followers yet"/> : (
            <div className="prof-people">
              {followers.map((f:any) => (
                <Link to={`/profile/${f.username}`} key={f.id} className="prof-person">
                  <div className="prof-person__avatar">{(f.displayName||f.username).charAt(0).toUpperCase()}</div>
                  <div>
                    <span className="prof-person__name">{f.displayName||f.username}</span>
                    <span className="prof-person__handle">@{f.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          following.length===0 ? <EmptyState icon="👥" title="Not following anyone"/> : (
            <div className="prof-people">
              {following.map((f:any) => (
                <Link to={`/profile/${f.username}`} key={f.id} className="prof-person">
                  <div className="prof-person__avatar">{(f.displayName||f.username).charAt(0).toUpperCase()}</div>
                  <div>
                    <span className="prof-person__name">{f.displayName||f.username}</span>
                    <span className="prof-person__handle">@{f.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
