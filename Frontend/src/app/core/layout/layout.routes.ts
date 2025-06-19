import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MAIN_LAYOUT_ROUTES } from './main-layout/main-layout.routes';

export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: MAIN_LAYOUT_ROUTES
    }
];