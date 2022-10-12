import { AfterViewInit, Component, Inject } from '@angular/core';
import * as formattedSources from './formattedSources';
import { DOCUMENT, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  formattedSources = formattedSources;
  shown = true;

  constructor(
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {}

  toggle() {
    this.shown = false;
    setTimeout(() => (this.shown = true), 500);
  }

  ngAfterViewInit(): void {
    const element = this.document.getElementById(this.location.path());
    setTimeout(() => {
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
