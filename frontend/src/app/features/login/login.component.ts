import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1 class="auth-card__title">Welcome Back</h1>
        <p class="auth-card__subtitle">Sign in to your collection</p>

        <form class="auth-card__form" (submit)="$event.preventDefault()">
          <app-input
            label="Email"
            type="email"
            placeholder="you@example.com"
            [required]="true"
          ></app-input>
          <app-input
            label="Password"
            type="password"
            placeholder="Your password"
            [required]="true"
          ></app-input>
          <app-button type="submit" variant="primary" class="auth-card__submit">
            Sign In
          </app-button>
        </form>

        <p class="auth-card__footer">
          Don't have an account? <a routerLink="/register">Create one</a>
        </p>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {}
