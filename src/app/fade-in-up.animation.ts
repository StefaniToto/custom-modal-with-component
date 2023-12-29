import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInUpAnimation = trigger('fadeInUp', [
  transition(':enter', [
    style({
      transform: 'translateY(3vh)',
      opacity: 0,
    }),
    animate(
      '400ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({
        transform: 'translateY(0)',
        opacity: 1,
      }),
    ),
  ]),
]);

export const fadeInOutUpAnimation = trigger('fadeInOutUp', [
  transition(':enter', [
    style({
      transform: 'translateY(3vh)',
      opacity: 0,
    }),
    animate(
      '400ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({
        transform: 'translateY(0)',
        opacity: 1,
      }),
    ),
  ]),
  transition(':leave', [
    style({
      transform: 'translateY(0)',
      opacity: 1,
    }),
    animate(
      '200ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({
        transform: 'translateY(3vh)',
        opacity: 0,
      }),
    ),
  ]),
]);

export const fadeOutDelayAnimation = trigger('fadeOutDelay', [
  transition(':leave', [
    style({
      opacity: '*',
    }),
    animate(
      '200ms 500ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({
        opacity: 0,
      }),
    ),
  ]),
]);
