import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'explore',
        loadComponent: () =>
          import('./features/explore/explore.component').then(
            (m) => m.ExploreComponent,
          ),
      },
      {
        path: 'games/:id',
        loadComponent: () =>
          import('./features/game-details/game-details.component').then(
            (m) => m.GameDetailsComponent,
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'collection',
        loadComponent: () =>
          import('./features/collection/collection.component').then(
            (m) => m.CollectionComponent,
          ),
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent,
          ),
      },
      {
        path: 'profile/:username',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
      {
        path: 'add-game',
        loadComponent: () =>
          import('./features/add-game/add-game.component').then(
            (m) => m.AddGameComponent,
          ),
      },
      {
        path: 'edit-game/:id',
        loadComponent: () =>
          import('./features/edit-game/edit-game.component').then(
            (m) => m.EditGameComponent,
          ),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/components/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
];
