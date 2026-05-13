import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './AddGame.scss';

const AddGame: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add Game</h1>
        <Link to="/collection"><Button variant="ghost">← Back to Collection</Button></Link>
      </div>

      <form className="form-layout" onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <h2 className="section-title">Game Information</h2>
          <div className="form-grid">
            <Input label="Title" placeholder="Super Metroid" required />
            <Input label="Platform" placeholder="SNES" required />
            <Input label="Genre" placeholder="Action" />
            <Input label="Release Year" type="number" placeholder="1994" />
            <Input label="Developer" placeholder="Nintendo" />
            <Input label="Publisher" placeholder="Nintendo" />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Collection Details</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-group__label">Condition</label>
              <select className="form-select"><option>Mint</option><option>Near Mint</option><option selected>Very Good</option><option>Good</option><option>Acceptable</option><option>Poor</option></select>
            </div>
            <div className="input-group">
              <label className="input-group__label">Region</label>
              <select className="form-select"><option selected>NTSC</option><option>PAL</option><option>NTSC-J</option><option>Region Free</option></select>
            </div>
            <Input label="Estimated Value ($)" type="number" placeholder="0.00" prefix="$" />
            <Input label="Personal Rating" type="number" placeholder="1-5" />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Notes</h2>
          <Input type="textarea" placeholder="Add personal notes about this game... (how you acquired it, memories, condition details)" rows={4} />
        </div>

        <div className="form-actions">
          <Link to="/collection"><Button variant="ghost">Cancel</Button></Link>
          <Button type="submit" variant="primary">Add to Collection</Button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
