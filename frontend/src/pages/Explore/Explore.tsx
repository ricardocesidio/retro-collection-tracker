import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { gamesApi, catalogApi } from '../../services/collections';
import { useDebounce } from '../../hooks/useDebounce';
import type { GameData, Platform } from '../../services/collections';
import type { Genre } from '../../services/collections';

const Explore: React.FC = () => {
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

  useEffect(() => {
    let c = false; setLoading(true);
    const p: Record<string,string> = { page: String(page), limit: '24' };
    if (debounce) p.search = debounce; if (platId) p.platform = platId; if (genreId) p.genre = genreId; if (sort) p.sort = sort;
    gamesApi.list(p).then((r)=>{if(!c){setGames(r.data);setTotal(r.total);setTotalPages(r.totalPages);}}).catch(()=>{if(!c)setGames([]);}).finally(()=>{if(!c)setLoading(false);});
    return () => { c = true; };
  }, [page, debounce, platId, genreId, sort]);

  return (
    <div className="page-shell">
      <section className="explore-hero">
        <h1 className="explore-hero__title">Explore the Catalog</h1>
        <p className="explore-hero__sub">{total.toLocaleString()} retro games across {platforms.length} platforms</p>
        <div className="explore-hero__search">
          <Input placeholder="Search by title, developer, or publisher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </section>

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

      {loading ? <LoadingSpinner /> : games.length === 0 ? (
        <EmptyState icon="🔍" title="No games found" message={debounce?`No results for "${debounce}"`:'Try adjusting your filters.'}/>
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
              <span style={{color: '$text-tertiary',fontSize:'.875rem',alignSelf:'center'}}>Page {page} of {totalPages}</span>
              <Button variant="ghost" disabled={page>=totalPages} onClick={()=>setPage((p)=>p+1)}>Next →</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
