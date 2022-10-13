import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';
import * as formattedSources from './formattedSources';
import { DOCUMENT, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  formattedSources = formattedSources;
  show = true;

  constructor(
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit(): void {
    const element = this.document.getElementById(this.location.path());
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
