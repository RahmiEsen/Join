import { Routes } from '@angular/router';
import { BoardComponent } from './board.component';

export const BOARD_ROUTES: Routes = [
    {
        path: '',
        component: BoardComponent,
        title: 'Board'
    }
];