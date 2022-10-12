import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-transition',
  templateUrl: 'transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionComponent {
  shown = true;
  toggle() {
    this.shown = !this.shown;
  }
}
