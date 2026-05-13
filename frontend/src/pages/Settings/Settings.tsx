import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api-client';
import './Settings.scss';

const Settings: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    if (state.user) {
      setForm({
        username: state.user.username || '',
        displayName: state.user.displayName || '',
        bio: state.user.bio || '',
      });
      setLoading(false);
    }
  }, [state.user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updated = await apiRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          username: form.username.trim() || undefined,
          displayName: form.displayName.trim() || undefined,
          bio: form.bio.trim() || undefined,
        }),
      });
      // Update the AuthContext user data to reflect changes immediately
      if (state.user) {
        Object.assign(state.user, updated);
      }
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading && state.loading) return <LoadingSpinner fullPage message="Loading settings..." />;

  return (
    <div className="page-container">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account and preferences</p>

      <div style={{ marginBottom: '1rem' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
      </div>

      <div className="settings__layout">
        <nav className="settings__nav">
          <button
            className={`settings__nav-item${activeTab === 'profile' ? ' settings__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
          >
            Profile
          </button>
          <button
            className={`settings__nav-item${activeTab === 'password' ? ' settings__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
          >
            Password
          </button>
        </nav>

        <div className="settings__content">
          {activeTab === 'profile' && (
            <div className="settings__section">
              <h2 className="section-title">Profile Information</h2>
              <form className="settings__form" onSubmit={handleProfileSubmit}>
                <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <Input label="Display Name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
                <Input label="Bio" type="textarea" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell other collectors about yourself..." />
                <div className="settings__actions">
                  <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="settings__section">
              <h2 className="section-title">Change Password</h2>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                To change your password, please use the forgot password flow on the login page.
              </p>
              <div className="settings__actions">
                <Button variant="outline" onClick={() => window.location.href = '/login'}>Go to Login</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
