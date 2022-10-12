import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-transition',
  templateUrl: 'transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionComponent {
  shown = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  toggle() {
    this.shown = false;
    setTimeout(() => {
      this.shown = true;
      this.changeDetectorRef.markForCheck();
    }, 500);
  }
}
