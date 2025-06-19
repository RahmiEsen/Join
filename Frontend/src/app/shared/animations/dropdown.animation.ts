import { animate, style, transition, trigger } from '@angular/animations';

export const dropdownAnimation = trigger('dropdownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(40px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(40px)' }))
  ])
]);
