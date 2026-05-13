import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import Button from '../../components/ui/Button/Button';
import { gamesApi, catalogApi } from '../../services/collections';
import { useDebounce } from '../../hooks/useDebounce';
import type { GameData, Platform } from '../../services/collections';
import type { Genre } from '../../services/collections';
import './Explore.scss';

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

  useEffect(() => {
    Promise.all([catalogApi.getPlatforms(), catalogApi.getGenres()])
      .then(([p, g]) => { setPlatforms(p); setGenres(g); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { page: String(page), limit: '24' };
        if (debouncedSearch) params.search = debouncedSearch;
        if (platformId) params.platform = platformId;
        if (genreId) params.genre = genreId;
        if (sort) params.sort = sort;
        const res = await gamesApi.list(params);
        if (!cancelled) {
          setGames(res.data);
          setTotal(res.total);
          setTotalPages(res.totalPages);
        }
      } catch {
        if (!cancelled) setGames([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, debouncedSearch, platformId, genreId, sort]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="page-container">
      <div className="explore__hero">
        <h1 className="page-title">Explore Catalog</h1>
        <p className="page-subtitle">
          {total.toLocaleString()} retro games across {platforms.length} platforms
        </p>
      </div>

      <div className="explore__filters">
        <Input
          placeholder="Search by title..."
          type="search"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="explore__filter-group">
          <select className="explore__select" value={platformId} onChange={handleFilterChange(setPlatformId)}>
            <option value="">All Platforms</option>
            {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="explore__select" value={genreId} onChange={handleFilterChange(setGenreId)}>
            <option value="">All Genres</option>
            {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select className="explore__select explore__select--sort" value={sort} onChange={handleFilterChange(setSort)}>
            <option value="">Sort: A-Z</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Collected</option>
          </select>
        </div>
      </div>

      <div className="explore__results-info">
        <span className="text-muted">
          Showing {games.length} of {total} results
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Discovering retro games..." />
      ) : games.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No games found"
          message={search ? `No results for "${search}". Try a different search term.` : 'No games match your filters. Try broadening your search.'}
        />
      ) : (
        <>
          <div className="explore__grid">
            {games.map((game) => (
              <Link to={`/games/${game.id}`} key={game.id} style={{ textDecoration: 'none' }}>
                <Card
                  imageUrl={game.coverImageUrl || `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(game.title)}`}
                  badge={game.platform.name}
                  clickable
                >
                  <h3 className="game-card__title">{game.title}</h3>
                  <div className="game-card__meta">
                    <Badge variant="info">{game.platform.name}</Badge>
                    <Badge variant="default">{game.genre.name}</Badge>
                  </div>
                  <div className="game-card__footer-info">
                    <span className="game-card__year">{game.releaseYear}</span>
                    {game._count && (
                      <span className="game-card__count">
                        {game._count.collections > 0 && `${game._count.collections} in collections`}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="explore__pagination">
              <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </Button>
              <span className="explore__page-info">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
