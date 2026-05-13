import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import './Collection.scss';

const Collection: React.FC = () => {
  const collection = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['Super Metroid', 'Chrono Trigger', 'Zelda: A Link to the Past', 'Final Fantasy VI', 'Super Mario World', 'Donkey Kong Country', 'Mega Man X', 'EarthBound'][i],
    platform: Array(8).fill('SNES'),
    condition: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Mint', 'Very Good', 'Good', 'Acceptable'][i],
    rating: [5, 5, 5, 5, 5, 4, 4, 5][i],
    value: [250, 200, 150, 180, 90, 85, 120, 400][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Game+${i + 1}`,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Collection</h1>
          <p className="page-subtitle">47 games · Est. value: $2,450</p>
        </div>
        <Link to="/add-game"><Button variant="primary">+ Add Game</Button></Link>
      </div>

      <div className="collection__filters">
        <Input placeholder="Search collection..." type="search" />
        <select className="collection__select"><option value="">All Platforms</option><option>SNES</option><option>NES</option><option>Genesis</option><option>PlayStation</option><option>Nintendo 64</option></select>
        <select className="collection__select"><option value="">All Conditions</option><option>Mint</option><option>Near Mint</option><option>Very Good</option><option>Good</option><option>Acceptable</option></select>
      </div>

      <div className="collection__grid">
        {collection.map((game) => (
          <Card key={game.id} imageUrl={game.imageUrl} title={game.title} badge={game.condition} clickable>
            <h3 className="game-card__title">{game.title}</h3>
            <div className="game-card__meta">
              <Badge variant="info">{game.platform}</Badge>
              <Badge variant="highlight">{game.rating}★</Badge>
              <span className="game-card__value">${game.value}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collection;
