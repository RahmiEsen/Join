import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

export const MAIN_LAYOUT_ROUTES: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'summary',
                loadChildren: () =>
                import('../../../features/summary/summary.routes').then(m => m.SUMMARY_ROUTES)
            }
        ]
    }
];