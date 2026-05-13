import React from 'react';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Settings.scss';

const Settings: React.FC = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account and preferences</p>

      <div className="settings__layout">
        <nav className="settings__nav">
          <button className="settings__nav-item settings__nav-item--active">Profile</button>
          <button className="settings__nav-item">Account</button>
          <button className="settings__nav-item">Notifications</button>
          <button className="settings__nav-item">Privacy</button>
        </nav>

        <div className="settings__content">
          <div className="settings__section">
            <h2 className="section-title">Profile Information</h2>
            <form className="settings__form" onSubmit={(e) => e.preventDefault()}>
              <div className="settings__avatar-section">
                <img src="https://placehold.co/80x80/1a1a30/e0e0e0?text=RC" alt="Avatar" className="settings__avatar" />
                <Button variant="outline" size="sm">Change Photo</Button>
              </div>
              <Input label="Username" placeholder="retro_collector" />
              <Input label="Bio" type="textarea" placeholder="Tell other collectors about yourself..." rows={3} />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <div className="settings__actions">
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>

          <div className="settings__section">
            <h2 className="section-title">Change Password</h2>
            <form className="settings__form" onSubmit={(e) => e.preventDefault()}>
              <Input label="Current Password" type="password" placeholder="Enter current password" />
              <Input label="New Password" type="password" placeholder="Min. 8 characters" />
              <Input label="Confirm New Password" type="password" placeholder="Repeat new password" />
              <div className="settings__actions">
                <Button type="submit" variant="secondary">Update Password</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
