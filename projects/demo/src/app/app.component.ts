import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toggleAnimation', [
      transition(':enter',
        [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
        ]),
      transition(':leave',
        [
          animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' })),
        ]),
    ]),
  ]
})

export class AppComponent {
  title = 'demo';
}
