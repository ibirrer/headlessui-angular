import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-demo-container',
  templateUrl: './demo-container.component.html',
})
export class DemoContainerComponent {
  @Input() name!: string;
}
