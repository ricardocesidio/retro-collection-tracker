import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Alert from '../../components/ui/Alert/Alert';
import { collectionApi, catalogApi } from '../../services/collections';
import { useDebounce } from '../../hooks/useDebounce';
import type { CollectionEntry, Platform } from '../../services/collections';

const Collection: React.FC = () => {
  const [items, setItems] = useState<CollectionEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string|null>(null);
  const [search, setSearch] = useState('');
  const debounce = useDebounce(search, 300);
  const [plat, setPlat] = useState('');
  const [cond, setCond] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const fetch = useCallback(async () => {
    setLoading(true);setError('');
    try {
      const p: Record<string,string> = {};
      if (debounce) p.search = debounce; if (plat) p.platform = plat; if (cond) p.condition = cond;
      const r = await collectionApi.list(p);
      setItems(r.data); setTotal(r.total); setTotalValue(r.totalValue||0);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [debounce, plat, cond]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { catalogApi.getPlatforms().then(setPlatforms).catch(()=>{}); }, []);

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await collectionApi.exportCollection(format);
    } catch (e: any) {
      setError(e.message || 'Export failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this game?')) return;
    setDeleting(id);
    try { await collectionApi.delete(id); setItems((p) => p.filter((g) => g.id !== id)); } catch (e: any) { setError(e.message); } finally { setDeleting(null); }
  };

  const fmt = (v:number) => '$'+v.toLocaleString();

  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div><h1 className="page-title">My Collection</h1><p className="page-sub">{total} games · Est. {fmt(totalValue)}</p></div>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
          <Button variant="ghost" size="sm" onClick={() => handleExport('csv')}><i className="fa-solid fa-file-csv"></i> CSV</Button>
          <Button variant="ghost" size="sm" onClick={() => handleExport('json')}><i className="fa-solid fa-file-code"></i> JSON</Button>
          <Link to="/add-game"><Button variant="primary">+ Add Game</Button></Link>
        </div>
      </div>

      <div className="page-shell-filters">
        <Input placeholder="Search collection..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" value={plat} onChange={(e) => setPlat(e.target.value)}><option value="">All Platforms</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <select className="form-select" value={cond} onChange={(e) => setCond(e.target.value)}><option value="">All Conditions</option>{['MINT','NEAR_MINT','VERY_GOOD','GOOD','ACCEPTABLE','POOR'].map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}</select>
      </div>

      {error && <div style={{marginBottom:'1rem'}}><Alert variant="danger">{error}</Alert></div>}

      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <EmptyState icon="🎮" title="No games yet" message="Start building your retro collection."><Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link><Link to="/add-game"><Button variant="outline">Add Game</Button></Link></EmptyState>
      ) : (
        <div className="page-grid">
          {items.map((item) => (
            <Link to={`/edit-game/${item.id}`} key={item.id} style={{textDecoration:'none',color:'inherit'}}>
              <div className="game-card-new">
                <div className="game-card-new__img">
                  <img src={item.game.coverImageUrl||`https://placehold.co/400x300/181c28/f1f5f9?text=${encodeURIComponent(item.game.title.slice(0,6))}`} alt="" loading="lazy"/>
                  <span className="game-card-new__condition">{item.condition.replace('_',' ')}</span>
                </div>
                <div className="game-card-new__body">
                  <h3 className="game-card-new__title">{item.game.title}</h3>
                  <p className="game-card-new__meta">{item.game.platform.name} · {item.game.genre.name}</p>
                  <div className="game-card-new__footer">
                    {item.personalRating && <span className={`ra-card__score ra-card__score--${item.personalRating >= 4 ? 'high' : item.personalRating >= 3 ? 'mid' : 'low'}`}>★ {item.personalRating}</span>}
                    {item.estimatedValue != null && <span className="game-card-new__value">{fmt(item.estimatedValue)}</span>}
                  </div>
                </div>
                <div className="game-card-new__actions" onClick={(e) => e.preventDefault()}>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)} loading={deleting===item.id}>Remove</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
