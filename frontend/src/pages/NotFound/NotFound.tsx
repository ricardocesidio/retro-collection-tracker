import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="notfound">
      <h1 className="notfound__code">404</h1>
      <h2 className="notfound__title">Page Not Found</h2>
      <p className="notfound__text">The page you're looking for doesn't exist or has been moved.</p>
      <div className="notfound__actions">
        <Link to="/" className="btn btn--primary">Go Home</Link>
        <Link to="/dashboard" className="btn btn--outline">Dashboard</Link>
        <Link to="/explore" className="btn btn--ghost">Explore Catalog</Link>
      </div>
    </div>
  );
};

export default NotFound;
