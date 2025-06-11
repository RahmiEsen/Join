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
    path: 'forgot-password',
    loadChildren: () => 
        import('./features/forgot-password/forgot-password.routes').then(m => m.FORGOTPASSWORD_ROUTES)
    },
    {
    path: 'reset-password',
    loadChildren: () => 
        import('./features/reset-password/reset-password.routes').then(m => m.RESETPASSWORD_ROUTES)
    },
    {
    path: 'auth-callback',
    loadChildren: () => 
        import('./features/auth-callback/auth-callback.routes').then(m => m.AUTHCALLBACK_ROUTES)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];