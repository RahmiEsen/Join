import { Routes } from '@angular/router';

export const MAIN_LAYOUT_ROUTES: Routes = [
    {
        path: 'add-task',
        loadChildren: () =>
        import('../../../features/add-task/add-task.routes').then((m) => m.ADD_TASK_ROUTES)
    },
    {
        path: 'board',
        loadChildren: () =>
        import('../../../features/board/board.routes').then((m) => m.BOARD_ROUTES)
    },
    {
        path: 'contacts',
        loadChildren: () =>
        import('../../../features/contacts/contacts.routes').then((m) => m.CONTACTS_ROUTES)
    },
    {
        path: 'help',
        loadChildren: () =>
        import('../../../features/help/help.routes').then((m) => m.HELP_ROUTES)
    },
    {
        path: 'privacy-policy',
        loadChildren: () =>
        import('../../../features/privacy-policy/privacy-policy.routes').then((m) => m.PRIVACY_POLICY_ROUTES)
    },
    {
        path: 'legal-notice',
        loadChildren: () =>
        import('../../../features/legal-notice/legal-notice.routes').then((m) => m.LEGAL_NOTICE_ROUTES)
    }
];