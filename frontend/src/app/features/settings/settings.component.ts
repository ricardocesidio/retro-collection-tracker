import { Component } from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [InputComponent, ButtonComponent],
  template: `
    <div class="page-container">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account and preferences</p>

      <div class="settings__layout">
        <nav class="settings__nav">
          <button class="settings__nav-item settings__nav-item--active">Profile</button>
          <button class="settings__nav-item">Account</button>
          <button class="settings__nav-item">Notifications</button>
          <button class="settings__nav-item">Privacy</button>
        </nav>

        <div class="settings__content">
          <div class="settings__section">
            <h2 class="section-title">Profile Information</h2>
            <form class="settings__form" (submit)="$event.preventDefault()">
              <div class="settings__avatar-section">
                <img src="https://placehold.co/80x80/1a1a30/e0e0e0?text=RC" alt="Avatar" class="settings__avatar" />
                <app-button variant="outline" size="sm">Change Photo</app-button>
              </div>
              <app-input label="Username" placeholder="retro_collector"></app-input>
              <app-input label="Bio" type="textarea" placeholder="Tell other collectors about yourself..." [rows]="3"></app-input>
              <app-input label="Email" type="email" placeholder="you@example.com"></app-input>
              <div class="settings__actions">
                <app-button type="submit" variant="primary">Save Changes</app-button>
              </div>
            </form>
          </div>

          <div class="settings__section">
            <h2 class="section-title">Change Password</h2>
            <form class="settings__form" (submit)="$event.preventDefault()">
              <app-input label="Current Password" type="password" placeholder="Enter current password"></app-input>
              <app-input label="New Password" type="password" placeholder="Min. 8 characters"></app-input>
              <app-input label="Confirm New Password" type="password" placeholder="Repeat new password"></app-input>
              <div class="settings__actions">
                <app-button type="submit" variant="secondary">Update Password</app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {}
