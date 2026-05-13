import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { collectionApi, gamesApi } from '../../services/collections';
import { catalogApi } from '../../services/collections';
import type { Platform, Genre } from '../../services/collections';
import './EditGame.scss';

const EditGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (!id) return;
    Promise.all([collectionApi.getById(id), catalogApi.getPlatforms(), catalogApi.getGenres()])
      .then(([entry, p, g]) => {
        setPlatforms(p);
        setGenres(g);
        setForm({
          title: entry.game.title,
          platformId: entry.game.platform.id,
          genreId: entry.game.genre.id,
          releaseYear: String(entry.game.releaseYear),
          developer: entry.game.developer || '',
          publisher: entry.game.publisher || '',
          description: entry.game.description || '',
          condition: entry.condition,
          region: entry.region,
          personalRating: entry.personalRating?.toString() || '',
          estimatedValue: entry.estimatedValue?.toString() || '',
          notes: entry.notes || '',
        });
      })
      .catch((err: any) => setError(err.message || 'Failed to load game'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.releaseYear || isNaN(Number(form.releaseYear)) || Number(form.releaseYear) < 1950 || Number(form.releaseYear) > 2030) {
      errs.releaseYear = 'Enter a valid year (1950-2030)';
    }
    const rating = form.personalRating ? parseInt(form.personalRating) : null;
    if (rating != null && (isNaN(rating) || rating < 1 || rating > 5)) {
      errs.personalRating = 'Rating must be 1-5';
    }
    if (Object.keys(errs).length > 0) { setError('Please fix the form errors'); return; }

    setSaving(true);
    setError('');

    try {
      await gamesApi.update(id, {
        title: form.title.trim(),
        platformId: form.platformId,
        genreId: form.genreId,
        releaseYear: parseInt(form.releaseYear),
        developer: form.developer.trim() || undefined,
        publisher: form.publisher.trim() || undefined,
        description: form.description.trim() || undefined,
      });

      await collectionApi.update(id, {
        condition: form.condition,
        region: form.region,
        personalRating: form.personalRating ? parseInt(form.personalRating) : null,
        estimatedValue: form.estimatedValue ? parseFloat(form.estimatedValue) : null,
        notes: form.notes.trim() || null,
      });

      navigate('/collection', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to update game');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Remove this game from your collection?')) return;
    setSaving(true);
    try {
      await collectionApi.delete(id);
      navigate('/collection', { replace: true });
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  if (loading) return <LoadingSpinner fullPage message="Loading game details..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Edit Game</h1>
        <Link to="/collection"><Button variant="ghost">← Back to Collection</Button></Link>
      </div>

      {error && <div style={{ marginBottom: '1rem' }}><Alert variant="danger">{error}</Alert></div>}

      <form className="form-layout" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="section-title">Game Information</h2>
          <div className="form-grid">
            <Input label="Title" value={form.title} onChange={updateField('title')} required />
            <div className="input-group">
              <label className="input-group__label">Platform</label>
              <select className="form-select" value={form.platformId} onChange={(e) => updateField('platformId')(e as any)}>
                {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-group__label">Genre</label>
              <select className="form-select" value={form.genreId} onChange={(e) => updateField('genreId')(e as any)}>
                {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <Input label="Release Year" type="number" value={form.releaseYear} onChange={updateField('releaseYear')} />
            <Input label="Developer" value={form.developer} onChange={updateField('developer')} />
            <Input label="Publisher" value={form.publisher} onChange={updateField('publisher')} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Collection Details</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-group__label">Condition</label>
              <select className="form-select" value={form.condition} onChange={(e) => updateField('condition')(e as any)}>
                {['MINT','NEAR_MINT','VERY_GOOD','GOOD','ACCEPTABLE','POOR'].map((c) => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-group__label">Region</label>
              <select className="form-select" value={form.region} onChange={(e) => updateField('region')(e as any)}>
                {['NTSC','PAL','NTSC_J','REGION_FREE'].map((r) => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
              </select>
            </div>
            <Input label="Estimated Value ($)" type="number" value={form.estimatedValue} onChange={updateField('estimatedValue')} prefix="$" />
            <Input label="Personal Rating (1-5)" type="number" value={form.personalRating} onChange={updateField('personalRating')} />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Notes</h2>
          <Input type="textarea" value={form.notes} onChange={updateField('notes')} rows={4} />
        </div>

        <div className="form-actions">
          <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Game</Button>
          <div className="form-actions__right">
            <Link to="/collection"><Button variant="ghost">Cancel</Button></Link>
            <Button type="submit" variant="primary" loading={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditGame;
