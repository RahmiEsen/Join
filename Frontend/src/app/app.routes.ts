import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './features/auth/auth-callback/auth-callback.component';
import { LAYOUT_ROUTES } from './core/layout/layout.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth-callback',
    component: AuthCallbackComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    children: LAYOUT_ROUTES
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];