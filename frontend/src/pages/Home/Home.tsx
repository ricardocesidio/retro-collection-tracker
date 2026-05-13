import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Build Your <span className="text-highlight">Retro</span><br />Collection
          </h1>
          <p className="hero__subtitle">
            Track, organize, and showcase your classic game collection.
            Join a community of retro gaming collectors.
          </p>
          <div className="hero__actions">
            <Link to="/register"><Button variant="primary" size="lg">Get Started</Button></Link>
            <Link to="/explore"><Button variant="outline" size="lg">Explore Catalog</Button></Link>
          </div>
        </div>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">12,000+</span>
            <span className="hero__stat-label">Games Cataloged</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">5,500+</span>
            <span className="hero__stat-label">Collectors</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">850+</span>
            <span className="hero__stat-label">Platforms</span>
          </div>
        </div>
      </section>

      <section className="features container">
        <h2 className="section-title">Everything You Need</h2>
        <div className="features__grid">
          {[
            { icon: '📚', title: 'Organize', desc: 'Catalog your collection with detailed metadata, condition tracking, and personal notes.' },
            { icon: '🔍', title: 'Discover', desc: 'Browse a public retro game database. Search by title, platform, genre, or release year.' },
            { icon: '⭐', title: 'Rate & Review', desc: 'Share your thoughts on games. Read community reviews to discover hidden gems.' },
            { icon: '📊', title: 'Track Stats', desc: 'View collection analytics — total value, platform distribution, completion stats.' },
            { icon: '💬', title: 'Connect', desc: 'Follow other collectors, see their collections, and grow your retro network.' },
            { icon: '📱', title: 'Any Device', desc: 'Fully responsive design. Manage your collection from desktop, tablet, or mobile.' },
          ].map((feat) => (
            <div key={feat.title} className="feature-card">
              <span className="feature-card__icon">{feat.icon}</span>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta__content container">
          <h2>Start Your Collection Today</h2>
          <p>Join thousands of retro gaming collectors. It's free.</p>
          <Link to="/register"><Button variant="primary" size="lg">Create Free Account</Button></Link>
        </div>
      </section>
    </>
  );
};

export default Home;
