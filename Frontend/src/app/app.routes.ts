import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './features/auth/auth-callback/auth-callback.component';

export const routes: Routes = [
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
    path: 'summary',
    loadChildren: () =>
      import('./features/summary/summary.routes').then((m) => m.SUMMARY_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
