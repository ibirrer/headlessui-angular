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
    if (show && !this.viewRef) {
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.viewRef) {
      this.viewContainer.clear();
      this.viewRef = null;
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
