import React from 'react';
import Card from '../../components/ui/Card/Card';
import Badge from '../../components/ui/Badge/Badge';
import Input from '../../components/ui/Input/Input';
import './Explore.scss';

const placeholderGames = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: ['Super Metroid', 'Chrono Trigger', 'The Legend of Zelda', 'Sonic the Hedgehog 2', 'Castlevania', 'Final Fantasy VI', 'Mega Man X', 'Donkey Kong Country', 'Street Fighter II', 'Metroid', 'Super Mario World', 'Contra'][i],
  platform: ['SNES', 'SNES', 'NES', 'Genesis', 'NES', 'SNES', 'SNES', 'SNES', 'SNES', 'NES', 'SNES', 'NES'][i],
  genre: ['Action', 'RPG', 'Adventure', 'Platformer', 'Action', 'RPG', 'Action', 'Platformer', 'Fighting', 'Action', 'Platformer', 'Action'][i],
  releaseYear: [1994, 1995, 1986, 1992, 1986, 1994, 1993, 1994, 1991, 1986, 1990, 1987][i],
  imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(['Super Metroid', 'Chrono Trigger', 'Zelda', 'Sonic 2', 'Castlevania', 'FFVI', 'Mega Man X', 'DKC', 'SFII', 'Metroid', 'SMW', 'Contra'][i])}`,
}));

const Explore: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Explore Catalog</h1>
      <p className="page-subtitle">Browse the retro gaming database</p>

      <div className="explore__filters">
        <Input placeholder="Search games..." type="search" />
        <div className="explore__filter-group">
          <select className="explore__select"><option value="">All Platforms</option><option>NES</option><option>SNES</option><option>Sega Genesis</option><option>PlayStation</option><option>Nintendo 64</option><option>Game Boy</option><option>Atari 2600</option></select>
          <select className="explore__select"><option value="">All Genres</option><option>Action</option><option>RPG</option><option>Platformer</option><option>Shooter</option><option>Puzzle</option><option>Racing</option><option>Fighting</option></select>
        </div>
      </div>

      <div className="explore__grid">
        {placeholderGames.map((game) => (
          <Card key={game.id} imageUrl={game.imageUrl} title={game.title} badge={game.platform} clickable>
            <h3 className="game-card__title">{game.title}</h3>
            <div className="game-card__meta">
              <Badge variant="info">{game.platform}</Badge>
              <Badge variant="default">{game.genre}</Badge>
              <span className="game-card__year">{game.releaseYear}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Explore;
