import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-demo-container',
  templateUrl: './demo-container.component.html',
})
export class DemoContainerComponent {
  @Input() name!: string;
  @Input() htmlSource!: string;
  @Input() typescriptSource!: string;
  display: 'Preview' | 'Html' | 'Typescript' = 'Preview';

  @HostBinding('class') hostStyle = 'block';
}
