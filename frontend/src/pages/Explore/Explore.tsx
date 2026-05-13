import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { gamesApi, catalogApi } from '../../services/collections';
import { useDebounce } from '../../hooks/useDebounce';
import type { GameData, Platform } from '../../services/collections';
import type { Genre } from '../../services/collections';

const Explore: React.FC = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [platformId, setPlatformId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => { Promise.all([catalogApi.getPlatforms(), catalogApi.getGenres()]).then(([p,g]) => { setPlatforms(p); setGenres(g); }).catch(() => {}); }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '24' };
    if (debouncedSearch) params.search = debouncedSearch;
    if (platformId) params.platform = platformId;
    if (genreId) params.genre = genreId;
    if (sort) params.sort = sort;
    gamesApi.list(params).then((r) => { if (!cancelled) { setGames(r.data); setTotal(r.total); setTotalPages(r.totalPages); } }).catch(() => { if (!cancelled) setGames([]); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, debouncedSearch, platformId, genreId, sort]);

  return (
    <div className="page-shell">
      <div className="page-shell__header">
        <div>
          <h1 className="page-shell__title">Explore Catalog</h1>
          <p className="page-shell__sub">{total.toLocaleString()} games available</p>
        </div>
      </div>

      <div className="page-shell__filters">
        <Input placeholder="Search games..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="page-select" value={platformId} onChange={(e) => { setPlatformId(e.target.value); setPage(1); }}>
          <option value="">All Platforms</option>
          {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="page-select" value={genreId} onChange={(e) => { setGenreId(e.target.value); setPage(1); }}>
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select className="page-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="">A-Z</option>
          <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="popular">Most Collected</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : games.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" message={debouncedSearch ? `No results for "${debouncedSearch}"` : 'Try a different filter.'} />
      ) : (
        <>
          <div className="page-grid">
            {games.map((g) => (
              <Link to={`/games/${g.id}`} key={g.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="game-card-new">
                  <div className="game-card-new__img">
                    <img src={g.coverImageUrl || `https://placehold.co/300x400/161924/e8eaed?text=${encodeURIComponent(g.title.slice(0,4))}`} alt="" />
                    <span className="game-card-new__condition">{g.platform.name}</span>
                  </div>
                  <div className="game-card-new__body">
                    <h3 className="game-card-new__title">{g.title}</h3>
                    <p className="game-card-new__meta">{g.platform.name} · {g.genre.name} · {g.releaseYear}</p>
                    {g._count && <p className="game-card-new__meta">{g._count.collections} in collections</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '2rem 0' }}>
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
              <span style={{ color: '#6b7280', fontSize: '0.875rem', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
              <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
