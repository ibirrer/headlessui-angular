import {
  Directive,
  EmbeddedViewRef,
  Input,
  NgModule,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[hlTransition]',
  exportAs: 'hlTransition',
})
export class TransitionDirective {
  @Input()
  set hlTransitionEnter(classes: string) {
    this.enterClasses = splitClasses(classes);
  }

  @Input()
  set hlTransitionEnterFrom(classes: string) {
    this.enterFromClasses = splitClasses(classes);
  }

  @Input()
  set hlTransitionEnterTo(classes: string) {
    this.enterToClasses = splitClasses(classes);
  }

  @Input()
  set hlTransitionLeave(classes: string) {
    this.leaveClasses = splitClasses(classes);
  }

  @Input()
  set hlTransitionLeaveFrom(classes: string) {
    this.leaveFromClasses = splitClasses(classes);
  }

  @Input()
  set hlTransitionLeaveTo(classes: string) {
    this.leaveToClasses = splitClasses(classes);
  }

  @Input()
  set hlTransition(show: boolean) {
    if (show) {
      this.cancelLeaveAnimation = true;
      if (!this.viewRef) {
        this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        const element = this.viewRef.rootNodes[0];
        element.classList.add(...this.enterFromClasses);
        flush(element);
        element.classList.remove(...this.enterFromClasses);
        element.classList.add(...this.enterClasses, ...this.enterToClasses);
      }
    } else {
      if (!this.viewRef) {
        console.error('viewRef not set');
        return;
      }

      this.cancelLeaveAnimation = false;
      const element = this.viewRef.rootNodes[0];
      const duration = getDuration(element);
      element.classList.remove(...this.enterClasses, ...this.enterToClasses);
      flush(element);
      element.

      setTimeout(() => {
        if (this.cancelLeaveAnimation) {
          return;
        }
        this.viewContainer.clear();
        this.viewRef = null;
      }, duration);
    }
  }

  private viewRef: EmbeddedViewRef<void> | null = null;
  private cancelLeaveAnimation = true;

  private enterClasses: string[] = [];
  private enterFromClasses: string[] = [];
  private enterToClasses: string[] = [];

  private leaveClasses: string[] = [];
  private leaveFromClasses: string[] = [];
  private leaveToClasses: string[] = [];

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<void>
  ) {}
}

@NgModule({
  imports: [],
  exports: [TransitionDirective],
  declarations: [TransitionDirective],
  providers: [],
})
export class TransitionModule {}

function splitClasses(classes: string) {
  return classes.split(' ').filter((className) => className.trim().length > 1);
}

function getDuration(element: HTMLElement) {
  // Safari returns a comma separated list of values, so let's sort them and take the highest value.
  let { transitionDuration, transitionDelay } = getComputedStyle(element);

  let [durationMs, delayMs] = [transitionDuration, transitionDelay].map(
    (value) => {
      let [resolvedValue = 0] = value
        .split(',')
        // Remove falsy we can't work with
        .filter(Boolean)
        // Values are returned as `0.3s` or `75ms`
        .map((v) => (v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000))
        .sort((a, z) => z - a);

      return resolvedValue;
    }
  );

  return durationMs + delayMs;
}

function flush(element: HTMLElement) {
  // See https://stackoverflow.com/a/24195559 why this is needed
  window.getComputedStyle(element).opacity;
}
