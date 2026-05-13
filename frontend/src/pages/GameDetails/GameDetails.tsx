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
  avgRating?: number|null;
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

  useEffect(() => {
    if (!id) return; let c = false; setLoading(true);
    Promise.all([gamesApi.getById(id), reviewsApi.getByGame(id)]).then(([g,rv])=>{if(!c){setGame(g as GameFull);if(rv) (g as any).reviews = rv.data; setLoading(false);}}).catch((e)=>{if(!c){setError(e.message);setLoading(false);}});
    return () => { c = true; };
  }, [id]);

  const addColl = async () => { if(!id)return; setAddingColl(true); try{await collectionApi.create({gameId:id});setActionMsg('Added to collection!');}catch(e:any){setActionMsg(e.message);}finally{setAddingColl(false);}};
  const addWish = async () => { if(!id)return; setAddingWish(true); try{await wishlistApi.add(id);setActionMsg('Added to wishlist!');}catch(e:any){setActionMsg(e.message);}finally{setAddingWish(false);}};

  if (loading) return <LoadingSpinner fullPage/>;
  if (error||!game) return <div className="page-shell"><EmptyState icon="🎮" title="Game not found" message="This game doesn't exist."><Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link></EmptyState></div>;

  const avg = game.avgRating ? parseFloat(game.avgRating.toFixed(1)) : null;
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
            <div className="gd-stat"><span className="gd-stat__val">{avg??'—'}</span><span className="gd-stat__lbl">Avg Rating</span></div>
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
        </div>
      </div>

      {/* Related Games */}
      {game.related && game.related.length > 0 && (
        <div className="gd-related">
          <h2 className="gd-section-title">You Might Also Like</h2>
          <div className="page-grid">
            {game.related.map((r) => (
              <Link to={`/games/${r.id}`} key={r.id} style={{textDecoration:'none',color:'inherit'}}>
                <div className="game-card-new">
                  <div className="game-card-new__img">
                    <img src={r.coverImageUrl||`https://placehold.co/400x300/181c28/f1f5f9?text=${encodeURIComponent(r.title.slice(0,6))}`} alt="" loading="lazy"/>
                    <span className="game-card-new__condition">{r.platform.name}</span>
                  </div>
                  <div className="game-card-new__body">
                    <h3 className="game-card-new__title">{r.title}</h3>
                    <p className="game-card-new__meta">{r.platform.name} · {r.genre.name} · {r.releaseYear}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
