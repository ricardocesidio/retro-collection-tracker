import React from 'react';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import './Profile.scss';

const Profile: React.FC = () => {
  const collection = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['Super Metroid', 'Chrono Trigger', 'Zelda ALTTP', 'FFVI', 'Super Mario World', 'DKC', 'Mega Man X', 'EarthBound'][i],
    platform: Array(8).fill('SNES'),
    condition: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Mint', 'Very Good', 'Good', 'Good'][i],
    rating: [5, 5, 5, 5, 5, 4, 4, 5][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Game+${i + 1}`,
  }));

  return (
    <div className="page-container">
      <div className="profile__header">
        <div className="profile__avatar">
          <img src="https://placehold.co/120x120/1a1a30/e0e0e0?text=RC" alt="Avatar" />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">retro_collector</h1>
          <p className="profile__bio">SNES enthusiast. Building a complete NA library one cartridge at a time.</p>
          <div className="profile__meta">
            <span><strong>47</strong> games</span>
            <span><strong>128</strong> followers</span>
            <span><strong>89</strong> following</span>
          </div>
          <div className="profile__actions">
            <Button variant="primary">Follow</Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      </div>

      <div className="profile__tabs">
        <button className="profile__tab profile__tab--active">Collection</button>
        <button className="profile__tab">Wishlist</button>
        <button className="profile__tab">Reviews</button>
      </div>

      <div className="profile__grid">
        {collection.map((game) => (
          <Card key={game.id} imageUrl={game.imageUrl} title={game.title} badge={game.condition} clickable>
            <h3 className="game-card__title">{game.title}</h3>
            <div className="game-card__meta">
              <Badge variant="info">{game.platform}</Badge>
              <Badge variant="highlight">{game.rating}★</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Profile;
