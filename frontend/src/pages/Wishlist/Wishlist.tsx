import React from 'react';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import './Wishlist.scss';

const Wishlist: React.FC = () => {
  const wishlist = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['EarthBound', 'Castlevania: SOTN', 'Panzer Dragoon Saga', 'Snatcher', 'MUSHA', 'Radiant Silvergun', 'Shining Force III', 'Suikoden II'][i],
    platform: ['SNES', 'PlayStation', 'Saturn', 'Sega CD', 'Genesis', 'Saturn', 'Saturn', 'PlayStation'][i],
    genre: ['RPG', 'Action', 'RPG', 'Adventure', 'Shooter', 'Shooter', 'RPG', 'RPG'][i],
    priority: [1, 1, 2, 2, 3, 2, 3, 1][i],
    estimatedPrice: [350, 180, 600, 500, 300, 250, 200, 280][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Wish+${i + 1}`,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Wishlist</h1>
          <p className="page-subtitle">12 games you want to collect</p>
        </div>
      </div>

      <div className="wishlist__grid">
        {wishlist.map((game) => (
          <Card key={game.id} imageUrl={game.imageUrl} title={game.title} badge={`Priority ${game.priority}`} clickable>
            <h3 className="game-card__title">{game.title}</h3>
            <div className="game-card__meta">
              <Badge variant="info">{game.platform}</Badge>
              <Badge variant="default">{game.genre}</Badge>
              <span className="game-card__price">~${game.estimatedPrice}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
