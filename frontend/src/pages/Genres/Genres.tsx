import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { catalogApi } from '../../services/collections';

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { catalogApi.getGenres().then(setGenres).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Genres</h1>
      <p className="page-sub">{genres.length} genres available</p>
      {genres.length === 0 ? <EmptyState icon="🏷️" title="No genres" /> : (
        <div className="page-grid">
          {genres.map((g) => (
            <Link key={g.id} to={`/explore?genre=${encodeURIComponent(g.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ fontSize: '1.5rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>{g.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
