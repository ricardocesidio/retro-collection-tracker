import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { apiRequest } from '../../services/api-client';
import { useDebounce } from '../../hooks/useDebounce';

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

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debounce = useDebounce(search, 300);
  const [results, setResults] = useState<ExternalGameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let c = false;
    setLoading(true);
    const q = debounce.trim();
    const params = q.length >= 2 ? `?q=${encodeURIComponent(q)}` : '';
    apiRequest<{ results: ExternalGameResult[]; source: string }>(`/games/external-search${params}`)
      .then((r) => { if (!c) setResults(r.results || []); })
      .catch(() => { if (!c) setResults([]); })
      .finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, [debounce]);

  const handleImport = async (ext: ExternalGameResult) => {
    setImporting(ext.sourceId);
    setError('');
    try {
      const result = await apiRequest<{ id: string; title: string }>('/games/import', {
        method: 'POST',
        body: JSON.stringify({ source: ext.source, sourceId: ext.sourceId }),
      });
      navigate(`/games/${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to import game');
      setImporting(null);
    }
  };

  return (
    <div className="page-shell">
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
      <section className="explore-hero">
        <h1 className="explore-hero__title">Explore the Catalog</h1>
        <p className="explore-hero__sub">{debounce ? `Searching "${debounce}"` : 'Browse popular games from the RAWG database'}</p>
        <div className="explore-hero__search">
          <Input placeholder="Search RAWG database for any game..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : results.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" message={debounce ? `No RAWG results for "${debounce}". Try a different search term.` : 'No popular games loaded. Try searching for something.'} />
      ) : (
        <div className="page-grid">
          {results.map((ext) => (
            <button
              key={`${ext.source}-${ext.sourceId}`}
              className="game-card-new"
              onClick={() => handleImport(ext)}
              disabled={importing === ext.sourceId}
              style={{ textAlign: 'left', cursor: 'pointer', width: '100%', border: 'none', padding: 0 }}
            >
              <div className="game-card-new__img">
                <img src={ext.coverImageUrl || PLACEHOLDER_COVER} alt={ext.title} loading="lazy" />
                <span className="game-card-new__condition">RAWG</span>
              </div>
              <div className="game-card-new__body">
                <h3 className="game-card-new__title">{ext.title}</h3>
                <p className="game-card-new__meta">
                  {ext.platform || 'Multi-platform'}
                  {ext.releaseYear ? ` · ${ext.releaseYear}` : ''}
                  {ext.genre ? ` · ${ext.genre}` : ''}
                </p>
                {ext.description && <p className="game-card-new__meta" style={{ color: '#64748b', marginTop: '0.25rem' }}>{ext.description.slice(0, 100)}...</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && !debounce && (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.825rem', marginTop: '2rem' }}>
          Showing top-rated games from RAWG. Search for something specific above.
        </p>
      )}
    </div>
  );
};

export default Explore;
