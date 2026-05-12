import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-card__title">Create Account</h1>
        <p class="auth-card__subtitle">Start building your collection</p>

        <form class="auth-card__form" (submit)="$event.preventDefault()">
          <app-input
            label="Username"
            type="text"
            placeholder="retro_collector"
            [required]="true"
          ></app-input>
          <app-input
            label="Email"
            type="email"
            placeholder="you@example.com"
            [required]="true"
          ></app-input>
          <app-input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            [required]="true"
          ></app-input>
          <app-input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            [required]="true"
          ></app-input>
          <app-button type="submit" variant="primary" class="auth-card__submit">
            Create Account
          </app-button>
        </form>

        <p class="auth-card__footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {}
