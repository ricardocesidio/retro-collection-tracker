import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { gamesApi, collectionApi, catalogApi } from '../../services/collections';
import type { GameData, Platform, Genre } from '../../types';
import './AddGame.scss';

const PLACEHOLDER_COVER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260"><rect fill="#1e1b4b" width="200" height="260"/><text x="100" y="130" text-anchor="middle" fill="#4c1d95" font-size="48" font-family="sans-serif">🎮</text></svg>');

const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [games, setGames] = useState<GameData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platformFilter, setPlatformFilter] = useState(searchParams.get('platform') || '');
  const [genreFilter, setGenreFilter] = useState(searchParams.get('genre') || '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [collectionForm, setCollectionForm] = useState({
    condition: 'GOOD',
    region: 'NTSC',
    personalRating: '',
    estimatedValue: '',
    notes: '',
  });

  useEffect(() => {
    Promise.all([catalogApi.getPlatforms(), catalogApi.getGenres()])
      .then(([p, g]) => { setPlatforms(p); setGenres(g); })
      .catch(() => {});
  }, []);

  const fetchGames = useCallback(async (searchTerm: string, pageNum: number, platform?: string, genre?: string) => {
    setSearching(true);
    try {
      const params: Record<string, string> = { limit: '50', page: String(pageNum) };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (platform) params.platform = platform;
      if (genre) params.genre = genre;
      const res = await gamesApi.list(params);
      if (pageNum === 1) {
        setGames(res.data);
      } else {
        setGames(prev => [...prev, ...res.data]);
      }
      setTotal(res.total);
      setHasMore(pageNum < res.totalPages);
      setPage(pageNum);
    } catch {
      setError('Failed to load games');
    } finally {
      setSearching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const timer = setTimeout(() => {
      fetchGames(search, 1, platformFilter, genreFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, platformFilter, genreFilter, fetchGames]);

  const loadMore = () => {
    if (!searching && hasMore) {
      fetchGames(search, page + 1, platformFilter, genreFilter);
    }
  };

  const handleSelectGame = (game: GameData) => {
    setSelectedGame(game);
    setError('');
    setSuccess('');
    searchInputRef.current?.focus();
  };

  const clearSelection = () => {
    setSelectedGame(null);
    setCollectionForm({ condition: 'GOOD', region: 'NTSC', personalRating: '', estimatedValue: '', notes: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await collectionApi.create({
        gameId: selectedGame.id,
        condition: collectionForm.condition,
        region: collectionForm.region,
        personalRating: collectionForm.personalRating ? parseInt(collectionForm.personalRating) : undefined,
        estimatedValue: collectionForm.estimatedValue ? parseFloat(collectionForm.estimatedValue) : undefined,
        notes: collectionForm.notes.trim() || undefined,
      });
      setSuccess(`${selectedGame.title} added to your collection!`);
      setSelectedGame(null);
      setCollectionForm({ condition: 'GOOD', region: 'NTSC', personalRating: '', estimatedValue: '', notes: '' });
      setTimeout(() => navigate('/collection', { replace: true }), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to add to collection');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="addgame-page">
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Add to Collection</h1>
            <p className="page-sub">Search the game catalog and add to your collection</p>
          </div>
          <Link to="/collection"><Button variant="ghost">← Back</Button></Link>
        </div>

        {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
        {success && <div style={{ marginBottom: '1rem' }}><Alert variant="success">{success}</Alert></div>}

        {!selectedGame && (
          <>
            <div className="addgame-search-bar">
              <div className="addgame-search-input-wrap">
                <i className="fa-solid fa-magnifying-glass addgame-search-icon" />
                <input
                  ref={searchInputRef}
                  className="addgame-search-input"
                  type="text"
                  placeholder="Search games by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                {search && <button className="addgame-search-clear" onClick={() => setSearch('')}><i className="fa-solid fa-xmark" /></button>}
              </div>
              <select className="addgame-filter-select" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                <option value="">All Platforms</option>
                {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select className="addgame-filter-select" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                <option value="">All Genres</option>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div className="addgame-results-header">
              <span className="addgame-results-count">{total} game{total !== 1 ? 's' : ''} found</span>
            </div>

            {loading ? (
              <LoadingSpinner fullPage />
            ) : games.length === 0 ? (
              <div className="addgame-empty">
                <i className="fa-solid fa-gamepad" style={{ fontSize: '3rem', color: 'var(--t3, #5a6480)', marginBottom: '1rem' }} />
                <h3>No games found</h3>
                <p>Try a different search term or browse the catalog</p>
                <Link to="/explore"><Button variant="outline">Browse All Games</Button></Link>
              </div>
            ) : (
              <>
                <div className="addgame-grid">
                  {games.map((game) => (
                    <button
                      key={game.id}
                      className="addgame-card"
                      onClick={() => handleSelectGame(game)}
                    >
                      <div className="addgame-card__cover">
                        <img src={game.coverImageUrl || PLACEHOLDER_COVER} alt={game.title} loading="lazy" />
                      </div>
                      <div className="addgame-card__info">
                        <span className="addgame-card__title">{game.title}</span>
                        <span className="addgame-card__meta">{game.platform.name} · {game.releaseYear}</span>
                        <span className="addgame-card__genre">{game.genre.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {hasMore && (
                  <div className="addgame-load-more">
                    <Button variant="outline" onClick={loadMore} loading={searching}>Load More</Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedGame && (
          <div className="addgame-selected-section">
            <div className="addgame-selected-header">
              <button className="addgame-back-btn" onClick={clearSelection}>
                <i className="fa-solid fa-arrow-left" /> Back to catalog
              </button>
            </div>

            <div className="addgame-selected-game">
              <div className="addgame-selected__cover">
                <img src={selectedGame.coverImageUrl || PLACEHOLDER_COVER} alt={selectedGame.title} />
              </div>
              <div className="addgame-selected__info">
                <h2 className="addgame-selected__title">{selectedGame.title}</h2>
                <span className="addgame-selected__meta">{selectedGame.platform.name} · {selectedGame.releaseYear}</span>
                <span className="addgame-selected__genre">{selectedGame.genre.name}</span>
                {selectedGame.developer && <span className="addgame-selected__dev">{selectedGame.developer}{selectedGame.publisher ? ` / ${selectedGame.publisher}` : ''}</span>}
                {selectedGame.description && <p className="addgame-selected__desc">{selectedGame.description}</p>}
              </div>
            </div>

            <form className="addgame-form" onSubmit={handleSubmit}>
              <h3 className="addgame-form__title">Collection Details</h3>
              <div className="addgame-form__grid">
                <div className="input-group">
                  <label className="input-group__label">Condition</label>
                  <select className="form-select" value={collectionForm.condition} onChange={(e) => setCollectionForm({ ...collectionForm, condition: e.target.value })}>
                    {['MINT','NEAR_MINT','VERY_GOOD','GOOD','ACCEPTABLE','POOR'].map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-group__label">Region</label>
                  <select className="form-select" value={collectionForm.region} onChange={(e) => setCollectionForm({ ...collectionForm, region: e.target.value })}>
                    {['NTSC','PAL','NTSC_J','REGION_FREE'].map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <Input label="Rating (1-5)" type="number" min="1" max="5" placeholder="5" value={collectionForm.personalRating} onChange={(e) => setCollectionForm({ ...collectionForm, personalRating: e.target.value })} />
                <Input label="Estimated Value ($)" type="number" min="0" step="0.01" placeholder="0.00" value={collectionForm.estimatedValue} onChange={(e) => setCollectionForm({ ...collectionForm, estimatedValue: e.target.value })} />
              </div>
              <div className="addgame-form__notes">
                <Input type="textarea" label="Notes" placeholder="Add personal notes about this copy..." value={collectionForm.notes} onChange={(e) => setCollectionForm({ ...collectionForm, notes: e.target.value })} rows={3} />
              </div>
              <div className="addgame-form__actions">
                <Button variant="ghost" onClick={clearSelection} type="button">Cancel</Button>
                <Button variant="primary" type="submit" loading={submitting}>
                  {submitting ? 'Adding...' : 'Add to Collection'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddGame;
