import { OverlayModule } from '@angular/cdk/overlay'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ListboxModule } from 'projects/headlessui-angular/src/lib/listbox/listbox'
import { MenuModule } from 'projects/headlessui-angular/src/public-api'
import { AppComponent } from './app.component'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenuModule,
    ListboxModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
