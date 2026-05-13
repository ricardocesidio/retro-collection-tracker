import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';

const NotFound: React.FC = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: '#e94560', marginBottom: '1rem' }}>404</h1>
      <p style={{ color: '#9e9e9e', marginBottom: '2rem', fontSize: '1.25rem' }}>Page not found</p>
      <Link to="/"><Button variant="primary">Go Home</Button></Link>
    </div>
  );
};

export default NotFound;
