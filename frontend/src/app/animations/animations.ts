// animations.ts
import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms 0s ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms 0s ease-out', style({ opacity: 0 }))
  ])
]);
