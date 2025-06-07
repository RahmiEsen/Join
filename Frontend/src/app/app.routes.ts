import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'login',
    loadChildren: () =>
        import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
    },
    {
    path: 'signup',
    loadChildren: () =>
        import('./features/signup/signup.routes').then(m => m.SIGNUP_ROUTES)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];