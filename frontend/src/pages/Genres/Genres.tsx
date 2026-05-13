import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { catalogApi } from '../../services/collections';
import type { Genre } from '../../services/collections';

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { catalogApi.getGenres().then(setGenres).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <LoadingSpinner />;

  const colors = ['#7c3aed', '#3b82f6', '#059669', '#d97706', '#ec4899', '#06b6d4', '#ef4444', '#6366f1'];

  return (
    <div className="page-shell">
      <h1 className="page-title">Genres</h1>
      <p className="page-sub">{genres.length} game genres</p>
      {genres.length === 0 ? <EmptyState icon="🎵" title="No genres" /> : (
        <div className="page-grid">
          {genres.map((g, i) => (
            <div key={g.id} className="panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderLeft: `3px solid ${colors[i % colors.length]}` }}>
              <div style={{ fontSize: '1.5rem' }}>🎮</div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>{g.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{g.slug}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
