import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { gamesApi, collectionApi } from '../../services/collections';
import { apiRequest } from '../../services/api-client';
import './AddGame.scss';

const PLACEHOLDER_COVER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260"><rect fill="#1e1b4b" width="200" height="260"/><text x="100" y="130" text-anchor="middle" fill="#4c1d95" font-size="48" font-family="sans-serif">🎮</text></svg>');

interface ExternalGameResult {
  source: 'rawg' | 'wikipedia';
  sourceId: string;
  title: string;
  releaseYear?: number;
  platform?: string;
  genre?: string;
  description?: string;
  coverImageUrl?: string;
  developer?: string;
  publisher?: string;
}

interface SelectedGame {
  id: string;
  title: string;
  releaseYear: number;
  developer?: string;
  publisher?: string;
  description?: string;
  coverImageUrl?: string;
  platform: { name: string };
  genre: { name: string };
}

const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<SelectedGame | null>(null);

  const [externalResults, setExternalResults] = useState<ExternalGameResult[]>([]);
  const [externalSearching, setExternalSearching] = useState(false);
  const [externalSource, setExternalSource] = useState<string>('');
  const [importingGame, setImportingGame] = useState(false);
  const [importedGameId, setImportedGameId] = useState<string | null>(null);

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
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setExternalResults([]);
      setExternalSource('');
      return;
    }
    setExternalSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiRequest<{ results: ExternalGameResult[]; source: string }>(`/games/external-search?q=${encodeURIComponent(search.trim())}`);
        if (!mountedRef.current) return;
        setExternalResults(res.results || []);
        setExternalSource(res.source);
      } catch {
        if (mountedRef.current) setExternalResults([]);
      } finally {
        if (mountedRef.current) setExternalSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const clearSelection = () => {
    if (importedGameId) { gamesApi.delete(importedGameId).catch(() => {}); setImportedGameId(null); }
    setSelectedGame(null);
    setCollectionForm({ condition: 'GOOD', region: 'NTSC', personalRating: '', estimatedValue: '', notes: '' });
  };

  const handleImportExternal = async (ext: ExternalGameResult) => {
    setImportingGame(true);
    setError('');
    try {
      const result = await apiRequest<{ id: string; title: string }>('/games/import', {
        method: 'POST',
        body: JSON.stringify({ source: ext.source, sourceId: ext.sourceId }),
      });
      setSelectedGame({
        id: result.id,
        title: result.title,
        releaseYear: ext.releaseYear || 2000,
        developer: ext.developer,
        publisher: ext.publisher,
        description: ext.description,
        coverImageUrl: ext.coverImageUrl,
        platform: { name: ext.platform || 'Other' },
        genre: { name: ext.genre || 'Other' },
      });
      setImportedGameId(result.id);
      setSearch('');
      setExternalResults([]);
    } catch (err: any) {
      setError(err.message || 'Failed to import game');
    } finally {
      setImportingGame(false);
    }
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
      setImportedGameId(null);
      setSuccess(`${selectedGame.title} added to your collection!`);
      setSelectedGame(null);
      setCollectionForm({ condition: 'GOOD', region: 'NTSC', personalRating: '', estimatedValue: '', notes: '' });
      setTimeout(() => navigate('/collection', { replace: true }), 1200);
    } catch (err: any) {
      if (importedGameId) {
        gamesApi.delete(importedGameId).catch(() => {});
        setImportedGameId(null);
      }
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
            <p className="page-sub">Search and import games from the RAWG database</p>
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
                  placeholder="Search RAWG database for any game..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                {search && <button className="addgame-search-clear" onClick={() => setSearch('')}><i className="fa-solid fa-xmark" /></button>}
              </div>
            </div>

            {!search.trim() && (
              <div className="addgame-empty">
                <i className="fa-solid fa-gamepad" style={{ fontSize: '3rem', color: 'var(--t3, #5a6480)', marginBottom: '1rem' }} />
                <h3>Search for a game</h3>
                <p>Type a game title above to search the RAWG database. Import any game and add it to your collection.</p>
              </div>
            )}

            {externalSearching && search.trim().length >= 2 && (
              <div className="addgame-external-section">
                <div className="addgame-external-header">
                  <LoadingSpinner />
                  <span className="addgame-external-title">Searching RAWG...</span>
                </div>
              </div>
            )}

            {!externalSearching && externalResults.length === 0 && search.trim().length >= 2 && (
              <div className="addgame-empty">
                <i className="fa-solid fa-gamepad" style={{ fontSize: '3rem', color: 'var(--t3, #5a6480)', marginBottom: '1rem' }} />
                <h3>No results found</h3>
                <p>Try a different search term</p>
              </div>
            )}

            {!externalSearching && externalResults.length > 0 && search.trim().length >= 2 && (
              <div className="addgame-external-section">
                <div className="addgame-external-header">
                  <span className="addgame-external-title">
                    <i className="fa-solid fa-globe" /> Results from RAWG
                  </span>
                  {externalSource === 'rawg' && <span className="addgame-external-badge">RAWG</span>}
                  {externalSource === 'wikipedia' && <span className="addgame-external-badge addgame-external-badge--wiki">Wikipedia</span>}
                </div>
                <div className="addgame-external-grid">
                  {externalResults.map((ext) => (
                    <button
                      key={`${ext.source}-${ext.sourceId}`}
                      className="addgame-card addgame-card--external"
                      onClick={() => handleImportExternal(ext)}
                      disabled={importingGame}
                    >
                      <div className="addgame-card__cover">
                        <img src={ext.coverImageUrl || PLACEHOLDER_COVER} alt={ext.title} loading="lazy" />
                      </div>
                      <div className="addgame-card__info">
                        <span className="addgame-card__title">{ext.title}</span>
                        {ext.platform && <span className="addgame-card__meta">{ext.platform}{ext.releaseYear ? ` · ${ext.releaseYear}` : ''}</span>}
                        {ext.genre && <span className="addgame-card__genre">{ext.genre}</span>}
                        {ext.description && <span className="addgame-card__desc">{ext.description.slice(0, 100)}...</span>}
                      </div>
                      <div className="addgame-card__import-badge">
                        <i className="fa-solid fa-cloud-arrow-down" /> Import
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedGame && (
          <div className="addgame-selected-section">
            <div className="addgame-selected-header">
              <button className="addgame-back-btn" onClick={clearSelection}>
                <i className="fa-solid fa-arrow-left" /> Back to search
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
