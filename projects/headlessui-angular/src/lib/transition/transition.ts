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
})
export class TransitionDirective {
  @Input()
  set hlTransition(show: boolean) {
    if (show) {
      console.log('show');
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      setTimeout(() => {
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
      }, 1000);
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
