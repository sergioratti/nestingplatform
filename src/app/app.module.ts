import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { LateralBarComponent } from './components/lateral-bar/lateral-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    LateralBarComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
