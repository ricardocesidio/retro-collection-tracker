import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './EditGame.scss';

const EditGame: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Edit Game</h1>
        <Link to="/collection"><Button variant="ghost">← Back to Collection</Button></Link>
      </div>

      <form className="form-layout" onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <h2 className="section-title">Game Information</h2>
          <div className="form-grid">
            <Input label="Title" value="Super Metroid" required />
            <Input label="Platform" value="SNES" required />
            <Input label="Genre" value="Action" />
            <Input label="Release Year" type="number" value="1994" />
            <Input label="Developer" value="Nintendo" />
            <Input label="Publisher" value="Nintendo" />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Collection Details</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-group__label">Condition</label>
              <select className="form-select"><option selected>Mint</option><option>Near Mint</option><option>Very Good</option><option>Good</option><option>Acceptable</option></select>
            </div>
            <div className="input-group">
              <label className="input-group__label">Region</label>
              <select className="form-select"><option selected>NTSC</option><option>PAL</option><option>NTSC-J</option><option>Region Free</option></select>
            </div>
            <Input label="Estimated Value ($)" type="number" value="250" prefix="$" />
            <Input label="Personal Rating" type="number" value="5" />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Notes</h2>
          <Input type="textarea" value="Complete in box. Cartridge is in perfect condition. Includes manual and original box." rows={4} />
        </div>

        <div className="form-actions">
          <Button variant="danger">Delete Game</Button>
          <div className="form-actions__right">
            <Link to="/collection"><Button variant="ghost">Cancel</Button></Link>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditGame;
