import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'summary',
                loadChildren: () =>
                import('../../features/summary/summary.routes').then((m) => m.SUMMARY_ROUTES)
            }
        ]
    }
];