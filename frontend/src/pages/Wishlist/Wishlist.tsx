import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { wishlistApi } from '../../services/social';
import type { WishlistEntry } from '../../services/social';
import './Wishlist.scss';

const Wishlist: React.FC = () => {
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await wishlistApi.list();
      setItems(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await wishlistApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Wishlist</h1>
          <p className="page-subtitle">{items.length} {items.length === 1 ? 'game' : 'games'} you want to collect</p>
        </div>
        <Link to="/explore"><Button variant="outline">Browse Catalog</Button></Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Loading your wishlist..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="Your wishlist is empty"
          message="Start adding games you want to collect. Browse the catalog and save games for later."
        >
          <Link to="/explore"><Button variant="primary">Explore Catalog</Button></Link>
        </EmptyState>
      ) : (
        <div className="wishlist__grid">
          {items.map((item) => (
            <Card
              key={item.id}
              imageUrl={item.game.coverImageUrl || `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(item.game.title)}`}
              clickable
            >
              <h3 className="game-card__title">{item.game.title}</h3>
              <div className="game-card__meta">
                <Badge variant="info">{item.game.platform.name}</Badge>
                <Badge variant="default">{item.game.genre.name}</Badge>
                <Badge variant={item.priority === 1 ? 'highlight' : item.priority === 2 ? 'warning' : 'default'}>
                  P{item.priority + 1}
                </Badge>
              </div>
              {item.notes && <p className="game-card__notes">{item.notes}</p>}
              <div className="game-card__actions">
                <Link to={`/games/${item.game.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                  loading={removing === item.id}
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

export default Wishlist;
