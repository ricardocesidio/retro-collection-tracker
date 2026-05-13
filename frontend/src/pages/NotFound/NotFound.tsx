import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1, fontFamily: "'DM Mono', monospace", letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Page Not Found</h2>
      <p style={{ color: '#8892b0', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6, fontSize: '0.9375rem' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn--primary">Go Home</Link>
        <Link to="/dashboard" className="btn btn--outline">Dashboard</Link>
        <Link to="/explore" className="btn btn--ghost">Explore Catalog</Link>
      </div>
    </div>
  );
};

export default NotFound;
