import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import Badge from '../../components/ui/Badge/Badge';
import { wishlistApi } from '../../services/social';
import type { WishlistEntry } from '../../services/social';

const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string|null>(null);

  const fetch = useCallback(async () => { setLoading(true);try{const r=await wishlistApi.list();setItems(r.data);}catch(e:any){setError(e.message);}finally{setLoading(false);} },[]);
  useEffect(()=>{fetch();},[fetch]);

  const remove =async(id:string)=>{setRemoving(id);try{await wishlistApi.remove(id);setItems((p)=>p.filter((i)=>i.id!==id));}catch(e:any){setError(e.message);}finally{setRemoving(null);}};

  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div><h1 className="page-title">Wishlist</h1><p className="page-sub">{items.length} games you want to collect</p></div>
        <Link to="/explore"><Button variant="outline">Browse Catalog</Button></Link>
      </div>
      {error && <div style={{marginBottom:'1rem'}}><Alert variant="danger">{error}</Alert></div>}
      {loading ? <LoadingSpinner/> : items.length===0 ? (
        <EmptyState icon="⭐" title="Your wishlist is empty" message="Explore the catalog and save games for later."><Link to="/explore"><Button variant="primary">Explore Catalog</Button></Link></EmptyState>
      ) : (
        <div className="page-grid">
          {items.map((w) => (
            <div key={w.id} className="game-card-new">
              <div className="game-card-new__img">
                <img src={w.game.coverImageUrl||`https://placehold.co/400x300/181c28/f1f5f9?text=${encodeURIComponent(w.game.title.slice(0,6))}`} alt="" loading="lazy"/>
                <span className="game-card-new__condition">P{w.priority+1}</span>
              </div>
              <div className="game-card-new__body">
                <h3 className="game-card-new__title">{w.game.title}</h3>
                <p className="game-card-new__meta">{w.game.platform.name} · {w.game.genre.name}</p>
                <div className="game-card-new__footer">
                  <Badge variant={w.priority===0?'highlight':w.priority===1?'warning':'default'}>Priority {w.priority+1}</Badge>
                </div>
              </div>
              <div className="game-card-new__actions">
                <Link to={`/games/${w.game.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                <Button variant="ghost" size="sm" onClick={()=>remove(w.id)} loading={removing===w.id}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
