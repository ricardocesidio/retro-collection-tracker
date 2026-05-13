import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import { apiRequest } from '../../services/api-client';
import './Home.scss';

const Home: React.FC = () => {
  const [stats, setStats] = useState({ games: 0, platforms: 0, collectors: 0 });

  useEffect(() => { apiRequest('/stats/public').then(setStats).catch(() => {}); }, []);

  const fmt = (n: number) => n >= 1000 ? `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, '0')}` : String(n);

  return (
    <div className="page-shell">
      <section className="home__hero">
        <div className="home__eyebrow"><i class="fa-solid fa-crown"></i> Retro Collection Platform</div>
        <h1 className="home__title">Build Your Retro<br />Collection</h1>
        <p className="home__subtitle">Track, organize, and showcase your classic game collection. Join {fmt(stats.collectors)} collectors across {stats.platforms} platforms.</p>
        <div className="home__cta">
          <Link to="/register"><Button variant="primary" size="lg">Get Started</Button></Link>
          <Link to="/explore"><Button variant="outline" size="lg">{fmt(stats.games)} Games · Explore</Button></Link>
        </div>
      </section>

      <div className="home__features">
        {[
          { icon: 'fa-solid fa-layer-group', title: 'Organize', desc: 'Catalog your collection with detailed metadata, condition tracking, and personal notes.' },
          { icon: 'fa-solid fa-magnifying-glass', title: 'Discover', desc: 'Browse a public retro game database. Search by title, platform, genre, or release year.' },
          { icon: 'fa-solid fa-star', title: 'Rate & Review', desc: 'Share your thoughts on games. Read community reviews to discover hidden gems.' },
          { icon: 'fa-solid fa-chart-pie', title: 'Track Stats', desc: 'View collection analytics — total value, platform distribution, completion stats.' },
          { icon: 'fa-solid fa-users', title: 'Connect', desc: 'Follow other collectors, see their collections, and grow your retro network.' },
          { icon: 'fa-solid fa-mobile-screen', title: 'Any Device', desc: 'Fully responsive design. Manage your collection from desktop, tablet, or mobile.' },
        ].map((feat) => (
          <div key={feat.title} className="home__feature">
            <span className="home__feature-icon"><i className={feat.icon} /></span>
            <h3 className="home__feature-title">{feat.title}</h3>
            <p className="home__feature-desc">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
