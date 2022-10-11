import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-transition-2',
  templateUrl: 'transition2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transition2Component {
  shown = true;
  toggle() {
    this.shown = !this.shown;
  }
}
