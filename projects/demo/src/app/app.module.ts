import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListboxModule } from 'projects/headlessui-angular/src/lib/listbox/listbox';
import { MenuModule } from 'projects/headlessui-angular/src/public-api';
import { AppComponent } from './app.component';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { StyledMenuComponent } from './demo-components/styled-menu/styled-menu.component';
import { StyledMenuCdkComponent } from './demo-components/styled-menu-cdk/styled-menu-cdk.component';
import { UnstyledMenuComponent } from './demo-components/unstyled-menu/unstyled-menu.component';
import { UnstyledSelectComponent } from './demo-components/unstyled-select/unstyled-select.component';
import { StyledSelectComponent } from './demo-components/styled-select/styled-select.component';
import { NgIconsModule } from '@ng-icons/core';
import { HeroCheck, HeroSelector } from '@ng-icons/heroicons/outline';
import {
  HashLocationStrategy,
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DemoContainerComponent,
    StyledMenuComponent,
    StyledMenuCdkComponent,
    UnstyledMenuComponent,
    UnstyledSelectComponent,
    StyledSelectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenuModule,
    ListboxModule,
    OverlayModule,
    NgIconsModule.withIcons({ HeroSelector, HeroCheck }),
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
