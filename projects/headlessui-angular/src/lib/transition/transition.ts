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
  cancelLeaveAnimation = true;
  enterToClasses: string[] = [];

  @Input()
  set hlTransitionEnterTo(classes: string) {
    console.log('enterTo', classes);
    this.enterToClasses = splitClasses(classes);
  }

  @Input()
  set hlTransition(show: boolean) {
    if (show) {
      this.cancelLeaveAnimation = true;
      if (!this.viewRef) {
        this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        console.log(this.enterToClasses);
        const element = this.viewRef.rootNodes[0];
        // See https://stackoverflow.com/a/24195559 why this is needed
        window.getComputedStyle(element).opacity;
        element.classList.add(...this.enterToClasses);
      }
    } else {
      this.cancelLeaveAnimation = false;
      // @ts-ignore
      this.timeoutId = setTimeout(() => {
        if (this.cancelLeaveAnimation) {
          return;
        }
        if (show) {
          console.log('t:show');
          this.viewRef = this.viewContainer.createEmbeddedView(
            this.templateRef
          );
        } else {
          console.log('t:hide');
          this.viewContainer.clear();
          this.viewRef = null;
        }
      }, 500);
    }
  }

  private viewRef: EmbeddedViewRef<void> | null = null;

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
