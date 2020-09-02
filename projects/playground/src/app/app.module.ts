import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageInputModule, SubstituteModule, OverlayModule, ResizeModule } from '@ng-utils';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    ImageInputModule,
    FormsModule,
    SubstituteModule,
    OverlayModule,
    ResizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
