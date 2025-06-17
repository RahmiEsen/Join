import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        children: AUTH_ROUTES
    },
    {
        path: 'summary',
        loadChildren: () =>
            import('./features/summary/summary.routes').then(m => m.SUMMARY_ROUTES)
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }
];