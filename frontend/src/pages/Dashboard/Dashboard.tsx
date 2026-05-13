import React from 'react';
import Button from '../../components/ui/Button/Button';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const platforms = [
    { name: 'SNES', count: 15, percentage: 32 },
    { name: 'NES', count: 12, percentage: 26 },
    { name: 'Genesis', count: 8, percentage: 17 },
    { name: 'PlayStation', count: 6, percentage: 13 },
    { name: 'Nintendo 64', count: 4, percentage: 8 },
    { name: 'Other', count: 2, percentage: 4 },
  ];

  const activities = [
    { id: 1, icon: '➕', message: 'Added Chrono Trigger to your collection', time: '2 hours ago' },
    { id: 2, icon: '⭐', message: 'Reviewed Super Metroid — 5 stars', time: '1 day ago' },
    { id: 3, icon: '📌', message: 'Saved EarthBound to your wishlist', time: '2 days ago' },
    { id: 4, icon: '👤', message: 'retrofan42 started following you', time: '3 days ago' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Your collection at a glance</p>

      <div className="dashboard__stats">
        {[
          { icon: '📚', value: '47', label: 'Games Owned' },
          { icon: '💎', value: '$2,450', label: 'Est. Collection Value' },
          { icon: '⭐', value: '12', label: 'Wishlist Items' },
          { icon: '📝', value: '8', label: 'Reviews Written' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-card__icon">{stat.icon}</span>
            <div className="stat-card__info">
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__section">
          <h2 className="section-title">Platform Distribution</h2>
          <div className="platform-list">
            {platforms.map((p) => (
              <div key={p.name} className="platform-item">
                <span>{p.name}</span>
                <div className="platform-item__bar"><div className="platform-item__fill" style={{ width: `${p.percentage}%` }} /></div>
                <span>{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard__section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {activities.map((a) => (
              <div key={a.id} className="activity-item">
                <span className="activity-item__type">{a.icon}</span>
                <div className="activity-item__content">
                  <p>{a.message}</p>
                  <span className="activity-item__time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
