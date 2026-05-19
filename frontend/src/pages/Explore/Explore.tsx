import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { apiRequest } from '../../services/api-client';
import { wishlistApi } from '../../services/social';
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
  rating?: number;
  metacritic?: number;
}

interface SearchResponse {
  results: ExternalGameResult[];
  total: number;
  source: string;
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debounce = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<ExternalGameResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState<Map<string, string>>(new Map());
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let c = false;
    setLoading(true);
    const q = debounce.trim();
    const params = new URLSearchParams();
    if (q.length >= 1) params.set('q', q);
    params.set('page', String(page));
    apiRequest<SearchResponse>(`/games/external-search?${params}`)
      .then((r) => { if (!c) { setResults(r.results || []); setTotal(r.total); } })
      .catch(() => { if (!c) { setResults([]); setTotal(0); } })
      .finally(() => { if (!c) setLoading(false); });
    return () => { c = true; };
  }, [debounce, page]);

  const handleImport = async (ext: ExternalGameResult) => {
    setImporting(ext.sourceId);
    setError('');
    try {
      const result = await apiRequest<{ id: string; title: string }>('/games/import', {
        method: 'POST',
        body: JSON.stringify({ source: ext.source, sourceId: ext.sourceId }),
      });
      navigate(`/add-game?import=${result.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to import game');
      setImporting(null);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent | React.KeyboardEvent, ext: ExternalGameResult) => {
    e.stopPropagation();
    setError('');

    if (wishlisted.has(ext.sourceId)) {
      const existingId = wishlisted.get(ext.sourceId);
      const next = new Map(wishlisted);
      next.delete(ext.sourceId);
      setWishlisted(next);
      if (existingId) {
        try { await wishlistApi.remove(existingId); } catch { return; }
      }
      return;
    }

    setImporting(ext.sourceId);
    try {
      const result = await apiRequest<{ id: string; title: string }>('/games/import', {
        method: 'POST',
        body: JSON.stringify({ source: ext.source, sourceId: ext.sourceId }),
      });
      await wishlistApi.add(result.id);
      navigate(`/add-game?import=${result.id}`);
    } catch (err: any) {
      if (err.message?.includes('already in wishlist') || err.message?.includes('Conflict')) {
        setWishlisted((prev) => new Map(prev).set(ext.sourceId, ''));
      } else {
        setError(err.message || 'Failed to add to wishlist');
      }
    } finally {
      setImporting(null);
    }
  };

  const totalPages = Math.ceil(total / 40);
  const filteredResults = starFilter
    ? results.filter(r => r.rating && Math.round(r.rating) === starFilter)
    : results;

  return (
    <div className="page-shell">
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
      <section className="explore-hero">
        <h1 className="explore-hero__title">Explore the Catalog</h1>
        <p className="explore-hero__sub">
          {debounce.trim().length >= 1
            ? `Searching "${debounce}" — ${total.toLocaleString()} results`
            : `${total.toLocaleString()} games available — browse popular titles from RAWG`}
        </p>
        <div className="explore-hero__search">
          <Input placeholder="Search RAWG database for any game..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="explore-stars">
          {[5,4,3,2,1].map((s) => (
            <button
              key={s}
              className={`explore-stars__btn${starFilter === s ? ' explore-stars__btn--active' : ''}`}
              onClick={() => { setStarFilter(starFilter === s ? null : s); setPage(1); }}
            >
              {s}<i className="fa-solid fa-star" />
            </button>
          ))}
          {starFilter && <button className="explore-stars__clear" onClick={() => setStarFilter(null)}>Clear</button>}
        </div>
        <div className="explore-alpha">
          <span className="explore-alpha__label">A–Z</span>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
            <button
              key={letter}
              className={`explore-alpha__letter${debounce.toUpperCase() === letter ? ' explore-alpha__letter--active' : ''}`}
              onClick={() => { setSearch(letter); setPage(1); }}
            >
              {letter}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : filteredResults.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" message={starFilter ? `No ${starFilter}-star games found. Try a different rating.` : debounce ? `No RAWG results for "${debounce}". Try a different search term.` : 'No popular games loaded. Try searching for something.'} />
      ) : (
        <>
          <div className="page-grid">
            {filteredResults.map((ext) => (
              <div
                key={`${ext.source}-${ext.sourceId}`}
                className="game-card-new"
                onClick={() => handleImport(ext)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleImport(ext)}
                style={{ cursor: 'pointer' }}
              >
                <div className="game-card-new__img">
                  <img src={ext.coverImageUrl || PLACEHOLDER_COVER} alt={ext.title} loading="lazy" />
                  <span className="game-card-new__condition">RAWG</span>
                  <button
                    type="button"
                    className={`game-card-new__wishlist-btn${wishlisted.has(ext.sourceId) ? ' game-card-new__wishlist-btn--added' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToWishlist(e, ext); }}
                    disabled={importing === ext.sourceId}
                    aria-label={wishlisted.has(ext.sourceId) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <i className={`fa${wishlisted.has(ext.sourceId) ? 's' : 'r'} fa-star`} />
                  </button>
                </div>
                <div className="game-card-new__body">
                  <h3 className="game-card-new__title">
                    <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{ext.title}</span>
                    {ext.rating && (
                        <span className={`ra-card__score ra-card__score--${ext.rating >= 4 ? 'high' : ext.rating >= 3 ? 'mid' : 'low'}`}>
                          {ext.rating.toFixed(1)}
                      </span>
                    )}
                  </h3>
                  <p className="game-card-new__meta">
                    {ext.platform || 'Multi-platform'}
                    {ext.releaseYear ? ` · ${ext.releaseYear}` : ''}
                    {ext.genre ? ` · ${ext.genre}` : ''}
                  </p>
                  {ext.description && <p className="game-card-new__meta" style={{ color: '#64748b', marginTop: '0.25rem' }}>{ext.description.slice(0, 100)}...</p>}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Page {page} of {totalPages}</span>
              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
