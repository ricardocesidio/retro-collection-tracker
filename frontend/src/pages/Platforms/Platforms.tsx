import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { catalogApi } from '../../services/collections';
import type { Platform } from '../../services/collections';

const Platforms: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { catalogApi.getPlatforms().then(setPlatforms).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-shell">
      <h1 className="page-title">Platforms</h1>
      <p className="page-sub">{platforms.length} supported platforms</p>
      {platforms.length === 0 ? <EmptyState icon="🕹️" title="No platforms" /> : (
        <div className="page-grid">
          {platforms.map((p) => (
            <div key={p.id} className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🕹️</div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>{p.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                {[p.manufacturer, p.releaseYear && `Released ${p.releaseYear}`].filter(Boolean).join(' · ') || 'Classic platform'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Platforms;
