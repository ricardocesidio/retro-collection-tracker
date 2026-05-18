import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Alert from '../../components/ui/Alert/Alert';
import { gamesApi, catalogApi } from '../../services/collections';
import { apiRequest } from '../../services/api-client';
import { useDebounce } from '../../hooks/useDebounce';
import type { GameData, Platform } from '../../services/collections';
import type { Genre } from '../../services/collections';

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
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState<GameData[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const urlPlatform = searchParams.get('platform') || '';
  const urlSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(urlSearch);
  const debounce = useDebounce(search, 300);
  const [platId, setPlatId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sort, setSort] = useState('');

  const [externalResults, setExternalResults] = useState<ExternalGameResult[]>([]);
  const [externalSearching, setExternalSearching] = useState(false);
  const [externalSource, setExternalSource] = useState('');
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    catalogApi.getPlatforms().then((p) => {
      setPlatforms(p);
      if (urlPlatform) {
        const matched = p.find((pl) => pl.name.toLowerCase() === urlPlatform.toLowerCase());
        if (matched) setPlatId(matched.id);
      }
    }).catch(()=>{});
    catalogApi.getGenres().then(setGenres).catch(()=>{});
  }, []);

  // Local games fetch (when no search query)
  useEffect(() => {
    if (debounce) return;
    let c = false; setLoading(true);
    const p: Record<string,string> = { page: String(page), limit: '24' };
    if (platId) p.platform = platId; if (genreId) p.genre = genreId; if (sort) p.sort = sort;
    gamesApi.list(p).then((r)=>{if(!c){setGames(r.data);setTotal(r.total);setTotalPages(r.totalPages);}}).catch(()=>{if(!c)setGames([]);}).finally(()=>{if(!c)setLoading(false);});
    return () => { c = true; };
  }, [page, debounce, platId, genreId, sort]);

  // RAWG search (when search query is present)
  useEffect(() => {
    if (!debounce || debounce.trim().length < 2) {
      setExternalResults([]);
      setExternalSource('');
      return;
    }
    let c = false;
    setExternalSearching(true);
    apiRequest<{ results: ExternalGameResult[]; source: string }>(`/games/external-search?q=${encodeURIComponent(debounce.trim())}`)
      .then((r) => { if (!c) { setExternalResults(r.results || []); setExternalSource(r.source); } })
      .catch(() => { if (!c) setExternalResults([]); })
      .finally(() => { if (!c) setExternalSearching(false); });
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

  const isSearching = debounce && debounce.trim().length >= 2;

  return (
    <div className="page-shell">
      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}
      <section className="explore-hero">
        <h1 className="explore-hero__title">Explore the Catalog</h1>
        <p className="explore-hero__sub">{isSearching ? `Searching RAWG for "${debounce}"` : `${total.toLocaleString()} retro games across ${platforms.length} platforms`}</p>
        <div className="explore-hero__search">
          <Input placeholder="Search RAWG database for any game..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </section>

      {!isSearching && (
        <div className="explore-filters">
          {platforms.map((p) => (
            <button key={p.id} className={`explore-filters__chip${platId===p.id?' explore-filters__chip--active':''}`} onClick={()=>{setPlatId(platId===p.id?'':p.id);setPage(1);}}>{p.name}</button>
          ))}
          <select className="form-select" value={genreId} onChange={(e)=>{setGenreId(e.target.value);setPage(1);}} style={{marginLeft:'auto'}}>
            <option value="">All Genres</option>
            {genres.map((g)=><option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select className="form-select" value={sort} onChange={(e)=>{setSort(e.target.value);setPage(1);}}>
            <option value="">A-Z</option><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="popular">Most Collected</option>
          </select>
        </div>
      )}

      {isSearching ? (
        externalSearching ? (
          <LoadingSpinner />
        ) : externalResults.length === 0 ? (
          <EmptyState icon="🔍" title="No results found" message={`No RAWG results for "${debounce}". Try a different search term.`} />
        ) : (
          <div className="page-grid">
            {externalResults.map((ext) => (
              <button
                key={`${ext.source}-${ext.sourceId}`}
                className="game-card-new"
                onClick={() => handleImport(ext)}
                disabled={importing === ext.sourceId}
                style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
              >
                <div className="game-card-new__img">
                  <img src={ext.coverImageUrl || PLACEHOLDER_COVER} alt={ext.title} loading="lazy" />
                  {ext.source === 'rawg' && <span className="game-card-new__condition">RAWG</span>}
                </div>
                <div className="game-card-new__body">
                  <h3 className="game-card-new__title">{ext.title}</h3>
                  <p className="game-card-new__meta">{ext.platform || 'Unknown platform'}{ext.releaseYear ? ` · ${ext.releaseYear}` : ''}{ext.genre ? ` · ${ext.genre}` : ''}</p>
                  {ext.description && <p className="game-card-new__meta" style={{ color: '#64748b', marginTop: '0.25rem' }}>{ext.description.slice(0, 100)}...</p>}
                </div>
              </button>
            ))}
          </div>
        )
      ) : loading ? (
        <LoadingSpinner />
      ) : games.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" message={search ? `No results for "${search}"` : 'Try adjusting your filters.'} />
      ) : (
        <>
          <div className="page-grid">
            {games.map((g) => (
              <Link to={`/games/${g.id}`} key={g.id} style={{textDecoration:'none',color:'inherit'}}>
                <div className="game-card-new">
                  <div className="game-card-new__img">
                    <img src={g.coverImageUrl||`https://placehold.co/400x300/181c28/f1f5f9?text=${encodeURIComponent(g.title.slice(0,6))}`} alt="" loading="lazy"/>
                    <span className="game-card-new__condition">{g.platform.name}</span>
                  </div>
                  <div className="game-card-new__body">
                    <h3 className="game-card-new__title">{g.title}</h3>
                    <p className="game-card-new__meta">{g.platform.name} · {g.genre.name} · {g.releaseYear}</p>
                    {g._count && <p className="game-card-new__meta">{g._count.collections} collectors own this</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{display:'flex',justifyContent:'center',gap:'1rem',padding:'2rem 0'}}>
              <Button variant="ghost" disabled={page<=1} onClick={()=>setPage((p)=>p-1)}>← Prev</Button>
              <span style={{fontSize:'.875rem',alignSelf:'center'}}>Page {page} of {totalPages}</span>
              <Button variant="ghost" disabled={page>=totalPages} onClick={()=>setPage((p)=>p+1)}>Next →</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
