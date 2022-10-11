import { Directive, ElementRef, Input, NgModule } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'transition',
})
export class Transition2Directive {
  private readonly element!: HTMLElement;

  private cancelLeaveAnimation = false;
  private ignoreRemoveMutation = false;

  private enterClasses: string[] = [];
  private enterFromClasses: string[] = [];
  private enterToClasses: string[] = [];

  private leaveClasses: string[] = [];
  private leaveFromClasses: string[] = [];
  private leaveToClasses: string[] = [];

  private initial = true;

  @Input()
  set enter(classes: string) {
    this.enterClasses = splitClasses(classes);
  }

  @Input()
  set enterFrom(classes: string) {
    this.enterFromClasses = splitClasses(classes);
  }

  @Input()
  set enterTo(classes: string) {
    this.enterToClasses = splitClasses(classes);
  }

  @Input()
  set leave(classes: string) {
    this.leaveClasses = splitClasses(classes);
  }

  @Input()
  set leaveFrom(classes: string) {
    this.leaveFromClasses = splitClasses(classes);
  }

  @Input()
  set leaveTo(classes: string) {
    this.leaveToClasses = splitClasses(classes);
  }

  observer = new MutationObserver((mutations) => {
    const addedNodes = mutations[0].addedNodes;
    const removedNodes = mutations[0].removedNodes;

    if (addedNodes.length > 0) {
      this.ignoreRemoveMutation = false;
      const element = addedNodes[0] as HTMLElement;
      if (!(element instanceof HTMLElement)) {
        return;
      }

      // prepare animation
      element.classList.add(...this.enterFromClasses);
      requestAnimationFrame(() => {
        // start animation
        element.classList.remove(...this.enterFromClasses);
        element.classList.add(...this.enterClasses, ...this.enterToClasses);
      });
    }

    if (removedNodes.length > 0 && !this.ignoreRemoveMutation) {
      const removedNode = removedNodes[0] as HTMLElement;
      const element = this.element.appendChild(removedNode);

      // prepare animation by removing enter-classes and add leave- and leaveFrom-classes.
      element.classList.remove(...this.enterClasses, ...this.enterToClasses);
      element.classList.add(...this.leaveClasses, ...this.leaveFromClasses);
      const duration = getDuration(element);
      setTimeout(() => {
        // start animation by removing from- and add to-classes
        element.classList.remove(...this.leaveFromClasses);
        element.classList.add(...this.leaveToClasses);

        // start timeout to remove element after animation finished
        setTimeout(() => {
          if (this.cancelLeaveAnimation) {
            return;
          }
          this.ignoreRemoveMutation = true;
          this.element.removeChild(removedNode);
        }, duration);
      });
    }
  });

  constructor(private elementRef: ElementRef) {
    this.element = this.elementRef.nativeElement;
    this.observer.observe(this.element, {
      attributes: true,
      childList: true,
      characterData: true,
    });
  }
}

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

@NgModule({
  imports: [],
  exports: [Transition2Directive],
  declarations: [Transition2Directive],
  providers: [],
})
export class TransitionModule2 {}
