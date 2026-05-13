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
import './Collection.scss';

const Collection: React.FC = () => {
  const [items, setItems] = useState<CollectionEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [platformFilter, setPlatformFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const fetchCollection = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (platformFilter) params.platform = platformFilter;
      if (conditionFilter) params.condition = conditionFilter;
      const res = await collectionApi.list(params);
      setItems(res.data); setTotal(res.total); setTotalValue(res.totalValue || 0);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [debouncedSearch, platformFilter, conditionFilter]);

  useEffect(() => { fetchCollection(); }, [fetchCollection]);
  useEffect(() => { catalogApi.getPlatforms().then(setPlatforms).catch(() => {}); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this game?')) return;
    setDeleting(id);
    try { await collectionApi.delete(id); setItems((i) => i.filter((g) => g.id !== id)); }
    catch (err: any) { setError(err.message); }
    finally { setDeleting(null); }
  };

  const fmt = (v: number) => '$' + v.toLocaleString();

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <div>
          <h1 className="page-shell__title">My Collection</h1>
          <p className="page-shell__sub">{total} games · Est. value {fmt(totalValue)}</p>
        </div>
        <Link to="/add-game"><Button variant="primary">+ Add Game</Button></Link>
      </div>

      <div className="page-shell__filters">
        <Input placeholder="Search collection..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="page-select" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
          <option value="">All Platforms</option>
          {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="page-select" value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
          <option value="">All Conditions</option>
          {['MINT','NEAR_MINT','VERY_GOOD','GOOD','ACCEPTABLE','POOR'].map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
        </select>
      </div>

      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}

      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <EmptyState icon="🎮" title="No games yet" message="Start building your collection.">
          <Link to="/explore"><Button variant="primary">Browse Catalog</Button></Link>
        </EmptyState>
      ) : (
        <div className="page-grid">
          {items.map((item) => (
            <div key={item.id} className="game-card-new">
              <div className="game-card-new__img">
                <img src={item.game.coverImageUrl || `https://placehold.co/300x400/161924/e8eaed?text=${encodeURIComponent(item.game.title.slice(0,4))}`} alt="" />
                <span className="game-card-new__condition">{item.condition.replace('_', ' ')}</span>
              </div>
              <div className="game-card-new__body">
                <h3 className="game-card-new__title">{item.game.title}</h3>
                <p className="game-card-new__meta">{item.game.platform.name} · {item.game.genre.name}</p>
                {item.personalRating && <div className="game-card-new__rating">★ {item.personalRating}</div>}
                {item.estimatedValue != null && <div className="game-card-new__value">{fmt(item.estimatedValue)}</div>}
              </div>
              <div className="game-card-new__actions">
                <Link to={`/edit-game/${item.id}`}><Button variant="ghost" size="sm">Edit</Button></Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} loading={deleting === item.id}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
