import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import { gamesApi, collectionApi } from '../../services/collections';
import { catalogApi } from '../../services/catalog';
import type { Platform, Genre } from '../../services/collections';
import './AddGame.scss';

const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    platformId: '',
    genreId: '',
    releaseYear: '',
    developer: '',
    publisher: '',
    description: '',
    condition: 'GOOD',
    region: 'NTSC',
    personalRating: '',
    estimatedValue: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([catalogApi.getPlatforms(), catalogApi.getGenres()])
      .then(([p, g]) => { setPlatforms(p); setGenres(g); if (p.length) setForm(f => ({ ...f, platformId: p[0].id })); if (g.length) setForm(f => ({ ...f, genreId: g[0].id })); })
      .catch(() => {});
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.platformId) errs.platformId = 'Platform is required';
    if (!form.genreId) errs.genreId = 'Genre is required';
    if (!form.releaseYear || isNaN(Number(form.releaseYear))) errs.releaseYear = 'Valid year required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');

    try {
      // First create the game in the catalog
      const game = await gamesApi.create({
        title: form.title.trim(),
        platformId: form.platformId,
        genreId: form.genreId,
        releaseYear: parseInt(form.releaseYear),
        developer: form.developer.trim() || undefined,
        publisher: form.publisher.trim() || undefined,
        description: form.description.trim() || undefined,
      });

      // Then add to collection
      await collectionApi.create({
        gameId: game.id,
        condition: form.condition,
        region: form.region,
        personalRating: form.personalRating ? parseInt(form.personalRating) : undefined,
        estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : undefined,
        notes: form.notes.trim() || undefined,
      });

      navigate('/collection', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to add game');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const updateSelect = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add Game</h1>
        <Link to="/collection"><Button variant="ghost">← Back to Collection</Button></Link>
      </div>

      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}

      <form className="form-layout" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Game Information</h2>
          <div className="form-grid">
            <Input label="Title *" placeholder="Super Metroid" value={form.title} onChange={updateField('title')} error={errors.title} />
            <div className="input-group">
              <label className="input-group__label">Platform *</label>
              <select className="form-select" value={form.platformId} onChange={updateSelect('platformId')}>
                {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.platformId && <span className="input-error">{errors.platformId}</span>}
            </div>
            <div className="input-group">
              <label className="input-group__label">Genre *</label>
              <select className="form-select" value={form.genreId} onChange={(e) => updateSelect('genreId')}>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              {errors.genreId && <span className="input-error">{errors.genreId}</span>}
            </div>
            <Input label="Release Year *" type="number" placeholder="1994" value={form.releaseYear} onChange={updateField('releaseYear')} error={errors.releaseYear} />
            <Input label="Developer" placeholder="Nintendo" value={form.developer} onChange={updateField('developer')} />
            <Input label="Publisher" placeholder="Nintendo" value={form.publisher} onChange={updateField('publisher')} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Collection Details</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-group__label">Condition</label>
              <select className="form-select" value={form.condition} onChange={(e) => updateSelect('condition')}>
                {['MINT','NEAR_MINT','VERY_GOOD','GOOD','ACCEPTABLE','POOR'].map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-group__label">Region</label>
              <select className="form-select" value={form.region} onChange={(e) => updateSelect('region')}>
                {['NTSC','PAL','NTSC_J','REGION_FREE'].map((r) => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
              </select>
            </div>
            <Input label="Estimated Value ($)" type="number" placeholder="0.00" value={form.estimatedValue} onChange={updateField('estimatedValue')} prefix="$" />
            <Input label="Personal Rating (1-5)" type="number" placeholder="5" value={form.personalRating} onChange={updateField('personalRating')} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Notes</h2>
          <Input type="textarea" placeholder="Add personal notes..." value={form.notes} onChange={updateField('notes')} rows={4} />
        </div>

        <div className="form-actions">
          <Link to="/collection"><Button variant="ghost">Cancel</Button></Link>
          <Button type="submit" variant="primary" loading={loading}>
            {loading ? 'Adding...' : 'Add to Collection'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
