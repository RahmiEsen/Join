import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () =>
        import('./login/login.routes').then((m) => m.LOGIN_ROUTES),
    },
    {
        path: 'signup',
        loadChildren: () =>
        import('./signup/signup.routes').then((m) => m.SIGNUP_ROUTES),
    },
    {
        path: 'forgot-password',
        loadChildren: () =>
        import('./forgot-password/forgot-password.routes').then((m) => m.FORGOTPASSWORD_ROUTES),
    },
    {
        path: 'reset-password',
        loadChildren: () =>
        import('./reset-password/reset-password.routes').then((m) => m.RESETPASSWORD_ROUTES),
    },
    {
        path: 'auth-callback',
        loadChildren: () =>
        import('./auth-callback/auth-callback.routes').then((m) => m.AUTHCALLBACK_ROUTES),
    }
];