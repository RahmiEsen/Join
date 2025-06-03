import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'signup',
    loadChildren: () =>
        import('./features/signup/signup.routes').then(m => m.SIGNUP_ROUTES)
    },
    {
        path: '',
        redirectTo: 'signup',
        pathMatch: 'full'
    }
];