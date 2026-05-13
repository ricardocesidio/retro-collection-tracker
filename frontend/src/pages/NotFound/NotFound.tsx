import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';

const NotFound: React.FC = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 700, color: '#e94560', lineHeight: 1, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: '#9e9e9e', marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
        <Link to="/explore"><Button variant="outline">Browse Catalog</Button></Link>
      </div>
    </div>
  );
};

export default NotFound;
