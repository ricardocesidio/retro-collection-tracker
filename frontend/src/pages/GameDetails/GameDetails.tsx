import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { gamesApi, collectionApi } from '../../services/collections';
import { wishlistApi, reviewsApi } from '../../services/social';
import { useAuth } from '../../context/AuthContext';
import type { GameData } from '../../services/collections';
import type { ReviewEntry } from '../../services/social';
import './GameDetails.scss';

interface GameFull extends GameData {
  communityRatingAverage?: number|null;
  communityRatingCount?: number;
  related?: GameData[];
  reviews?: ReviewEntry[];
}

const GameDetails: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const { state: authState } = useAuth();
  const [game, setGame] = useState<GameFull|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingColl, setAddingColl] = useState(false);
  const [addingWish, setAddingWish] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return; let c = false; setLoading(true);
    Promise.all([gamesApi.getById(id), reviewsApi.getByGame(id)]).then(([g,rv])=>{if(!c){setGame(g as GameFull);if(rv) (g as any).reviews = rv.data; setLoading(false);}}).catch((e)=>{if(!c){setError(e.message);setLoading(false);}});
    return () => { c = true; };
  }, [id]);

  const addColl = async () => { if(!id)return; setAddingColl(true); try{await collectionApi.create({gameId:id});setActionMsg('Added to collection!');}catch(e:any){setActionMsg(e.message);}finally{setAddingColl(false);}};
  const addWish = async () => { if(!id)return; setAddingWish(true); try{await wishlistApi.add(id);setActionMsg('Added to wishlist!');}catch(e:any){setActionMsg(e.message);}finally{setAddingWish(false);}};

  const submitReview = async () => {
    if (!id || !reviewRating) return;
    setSubmittingReview(true);
    try {
      const r = await reviewsApi.create(id, reviewRating, reviewTitle || undefined, reviewBody || undefined);
      setGame((prev) => prev ? { ...prev, reviews: [r, ...(prev.reviews || [])] } : prev);
      setReviewRating(0); setReviewTitle(''); setReviewBody('');
      setActionMsg('Review submitted!');
    } catch (e: any) { setActionMsg(e.message); } finally { setSubmittingReview(false); }
  };

  const handleToggleLike = async (reviewId: string) => {
    try {
      const { likes } = await reviewsApi.toggleLike(reviewId);
      setGame((prev) => prev ? { ...prev, reviews: prev.reviews?.map((rv) => rv.id === reviewId ? { ...rv, likes } : rv) } : prev);
    } catch { /* ignore */ }
  };

  const toggleComments = async (reviewId: string) => {
    const next = { ...expandedComments, [reviewId]: !expandedComments[reviewId] };
    setExpandedComments(next);
    if (next[reviewId] && !comments[reviewId]) {
      const data = await reviewsApi.getComments(reviewId);
      setComments((prev) => ({ ...prev, [reviewId]: data }));
    }
  };

  const addComment = async (reviewId: string) => {
    const text = commentInputs[reviewId]?.trim();
    if (!text) return;
    await reviewsApi.addComment(reviewId, text);
    setCommentInputs((prev) => ({ ...prev, [reviewId]: '' }));
    const data = await reviewsApi.getComments(reviewId);
    setComments((prev) => ({ ...prev, [reviewId]: data }));
  };

  if (loading) return <LoadingSpinner fullPage/>;
  if (error||!game) return <div className="page-shell"><EmptyState icon="🎮" title="Game not found" message="This game doesn't exist."><Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link></EmptyState></div>;

  const avg = game.communityRatingAverage ?? null;
  const fmt = (v:number) => '$'+v.toLocaleString();

  return (
    <div className="page-shell">
      <Link to="/explore" className="gd-back">← Back to Catalog</Link>

      <div className="gd-layout">
        {/* Cover */}
        <div className="gd-cover">
          <div className="gd-cover__img">
            <img src={game.coverImageUrl||`https://placehold.co/600x800/181c28/f1f5f9?text=${encodeURIComponent(game.title)}`} alt={game.title}/>
          </div>
        </div>

        {/* Info */}
        <div className="gd-info">
          <div className="gd-header">
            <h1 className="gd-title">{game.title}</h1>
            <div className="gd-tags">
              <Badge variant="info">{game.platform.name}</Badge>
              <Badge variant="default">{game.genre.name}</Badge>
              <Badge variant="highlight">{game.releaseYear}</Badge>
            </div>
          </div>

          <div className="gd-meta-grid">
            {[['Developer',game.developer],['Publisher',game.publisher],['Platform',game.platform.name],['Genre',game.genre.name],['Year',String(game.releaseYear)],game.platform.manufacturer?['Manufacturer',game.platform.manufacturer]:null].filter(Boolean).map(([k,v])=>k&&<div key={k} className="gd-meta-item"><span className="gd-meta-item__label">{k}</span><span className="gd-meta-item__value">{v}</span></div>)}
          </div>

          {game.description && <div className="gd-desc"><h3>About</h3><p>{game.description}</p></div>}

          <div className="gd-stats-row">
            {game.rawgRating ? <div className="gd-stat"><span className="gd-stat__val">{game.rawgRating.toFixed(1)}</span><span className="gd-stat__lbl"><Badge variant="default" style={{fontSize:'0.6rem',padding:'1px 6px'}}>RAWG</Badge></span></div> : null}
            <div className="gd-stat"><span className="gd-stat__val">{avg?.toFixed(1) ?? '—'}</span><span className="gd-stat__lbl">Community{game.communityRatingCount ? ` (${game.communityRatingCount})` : ''}</span></div>
            <div className="gd-stat"><span className="gd-stat__val">{game._count?.collections||0}</span><span className="gd-stat__lbl">In Collections</span></div>
            <div className="gd-stat"><span className="gd-stat__val">{game._count?.wishlists||0}</span><span className="gd-stat__lbl">Wishlisted</span></div>
            <div className="gd-stat"><span className="gd-stat__val">{game._count?.reviews||0}</span><span className="gd-stat__lbl">Reviews</span></div>
          </div>

          {authState.user && (
            <div className="gd-actions">
              <Button variant="primary" onClick={addColl} loading={addingColl}>Add to Collection</Button>
              <Button variant="outline" onClick={addWish} loading={addingWish}>Add to Wishlist</Button>
            </div>
          )}
          {actionMsg && <p className="gd-action-msg">{actionMsg}</p>}

          {authState.user && (
            <div className="gd-review-form">
              <h3 className="gd-section-title">Write a Review</h3>
              <div className="gd-review-form__stars">
                {[1,2,3,4,5].map((s) => (
                  <i key={s} className={`fa-${s <= reviewRating ? 'solid' : 'regular'} fa-star gd-review-form__star${s <= reviewRating ? ' gd-review-form__star--active' : ''}`} onClick={() => setReviewRating(s)} />
                ))}
              </div>
              <input className="form-input gd-review-form__input" placeholder="Title (optional)" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} />
              <textarea className="form-input gd-review-form__input" placeholder="Your review (optional)" value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} rows={4} />
              <Button variant="primary" onClick={submitReview} loading={submittingReview} disabled={!reviewRating}>Submit Review</Button>
            </div>
          )}
        </div>
      </div>

      <div className="gd-reviews">
        <h2 className="gd-section-title">Reviews ({game.reviews?.length ?? game._count?.reviews ?? 0})</h2>
        {(!game.reviews || game.reviews.length === 0) ? (
          <p className="gd-reviews__empty">No reviews yet. Be the first!</p>
        ) : (
          <div className="gd-reviews__list">
            {game.reviews.map((rv) => (
              <div key={rv.id} className="gd-review-card">
                <div className="gd-review-card__header">
                  <div className="gd-review-card__user">
                    {rv.user.avatarUrl ? <img src={rv.user.avatarUrl} alt="" className="gd-review-card__avatar" /> : <div className="gd-review-card__avatar gd-review-card__avatar--placeholder"><i className="fa-solid fa-user" /></div>}
                    <span className="gd-review-card__username">{rv.user.displayName || rv.user.username}</span>
                    <span className="gd-review-card__date">{new Date(rv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="gd-review-card__stars">
                    {[1,2,3,4,5].map((s) => (
                      <i key={s} className={`fa-${s <= rv.rating ? 'solid' : 'regular'} fa-star gd-review-card__star${s <= rv.rating ? ' gd-review-card__star--active' : ''}`} />
                    ))}
                  </div>
                </div>
                {rv.title && <h4 className="gd-review-card__title">{rv.title}</h4>}
                {rv.body && <p className="gd-review-card__body">{rv.body}</p>}
                <div className="gd-review-card__footer">
                  <button className="gd-review-card__like" onClick={() => handleToggleLike(rv.id)}>
                    <i className="fa-solid fa-heart" /> <span>{rv.likes}</span>
                  </button>
                </div>
                <button className="gd-comment-toggle" onClick={() => toggleComments(r.id)}>
                  💬 {comments[r.id]?.length ?? 0} comments
                </button>
                {expandedComments[r.id] && (
                  <div className="gd-comments">
                    {(comments[r.id] || []).map((c: any) => (
                      <div key={c.id} className="gd-comment">
                        <div className="gd-comment__avatar">{c.user.avatarUrl ? <img src={c.user.avatarUrl} alt="" /> : <span>{c.user.displayName?.charAt(0) || c.user.username.charAt(0)}</span>}</div>
                        <div className="gd-comment__body">
                          <span className="gd-comment__user">{c.user.displayName || c.user.username}</span>
                          <p className="gd-comment__text">{c.content}</p>
                          <span className="gd-comment__time">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    <div className="gd-comment-input">
                      <input value={commentInputs[r.id] || ''} onChange={(e) => setCommentInputs((prev) => ({ ...prev, [r.id]: e.target.value }))} placeholder="Write a comment..." className="gd-comment-input__field" />
                      <button className="gd-comment-input__btn" onClick={() => addComment(r.id)} disabled={!commentInputs[r.id]?.trim()}><i className="fa-solid fa-paper-plane" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
