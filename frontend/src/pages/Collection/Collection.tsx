import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
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
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (platformFilter) params.platform = platformFilter;
      if (conditionFilter) params.condition = conditionFilter;

      const res = await collectionApi.list(params);
      setItems(res.data);
      setTotal(res.total);
      setTotalValue(res.totalValue || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, platformFilter, conditionFilter]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  useEffect(() => {
    catalogApi.getPlatforms().then(setPlatforms).catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this game from your collection?')) return;
    setDeleting(id);
    try {
      await collectionApi.delete(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const conditions = ['MINT', 'NEAR_MINT', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE', 'POOR'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Collection</h1>
          <p className="page-subtitle">
            {total} {total === 1 ? 'game' : 'games'}
            {totalValue > 0 && <> · Est. value: ${totalValue.toLocaleString()}</>}
          </p>
        </div>
        <Link to="/add-game"><Button variant="primary">+ Add Game</Button></Link>
      </div>

      <div className="collection__filters">
        <Input
          placeholder="Search collection..."
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="collection__select"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          className="collection__select"
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
        >
          <option value="">All Conditions</option>
          {conditions.map((c) => (
            <option key={c} value={c}>{c.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Loading your collection..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon="🎮"
          title="Your collection is empty"
          message="Start building your retro game library. Add your first game to get started."
        >
          <Link to="/add-game"><Button variant="primary">Add Your First Game</Button></Link>
          <Link to="/explore"><Button variant="outline">Browse Catalog</Button></Link>
        </EmptyState>
      ) : (
        <div className="collection__grid">
          {items.map((item) => (
            <Card
              key={item.id}
              imageUrl={item.game.coverImageUrl || `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(item.game.title)}`}
              title={item.game.title}
              clickable
            >
              <h3 className="game-card__title">{item.game.title}</h3>
              <div className="game-card__meta">
                <Badge variant="info">{item.game.platform.name}</Badge>
                <Badge variant="default">{item.condition.replace('_', ' ')}</Badge>
                {item.personalRating && (
                  <Badge variant="highlight">{item.personalRating}★</Badge>
                )}
                {item.estimatedValue != null && (
                  <span className="game-card__value">${item.estimatedValue}</span>
                )}
              </div>
              <div className="game-card__actions">
                <Link to={`/edit-game/${item.id}`}>
                  <Button variant="ghost" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  loading={deleting === item.id}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
