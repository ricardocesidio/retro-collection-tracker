import React from 'react';
import Badge from '../../components/ui/Badge/Badge';
import Button from '../../components/ui/Button/Button';
import './GameDetails.scss';

const GameDetails: React.FC = () => {
  return (
    <div className="page-container">
      <div className="game-detail">
        <div className="game-detail__image">
          <img src="https://placehold.co/600x800/1a1a30/e0e0e0?text=Game+Cover" alt="Game cover" />
        </div>
        <div className="game-detail__info">
          <div className="game-detail__header">
            <h1 className="page-title">Super Metroid</h1>
            <div className="game-detail__tags">
              <Badge variant="info">SNES</Badge>
              <Badge variant="default">Action</Badge>
              <Badge variant="highlight">1994</Badge>
            </div>
          </div>
          <div className="game-detail__meta">
            <div className="game-detail__meta-item"><span className="label">Developer</span><span className="value">Nintendo</span></div>
            <div className="game-detail__meta-item"><span className="label">Publisher</span><span className="value">Nintendo</span></div>
            <div className="game-detail__meta-item"><span className="label">Region</span><span className="value">NTSC</span></div>
          </div>
          <p className="game-detail__description">Super Metroid is an action-adventure game developed and published by Nintendo for the Super Nintendo Entertainment System. The third installment in the Metroid series, it follows bounty hunter Samus Aran as she travels to planet Zebes to retrieve a stolen Metroid.</p>
          <div className="game-detail__actions">
            <Button variant="primary">Add to Collection</Button>
            <Button variant="outline">Add to Wishlist</Button>
            <Button variant="ghost">Write Review</Button>
          </div>
          <div className="game-detail__stats">
            <div className="stat"><span className="stat__value">4.8</span><span className="stat__label">Avg Rating</span></div>
            <div className="stat"><span className="stat__value">2.3k</span><span className="stat__label">In Collections</span></div>
            <div className="stat"><span className="stat__value">890</span><span className="stat__label">Reviews</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
