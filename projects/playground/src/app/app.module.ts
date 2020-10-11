import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageInputModule, SubstituteModule, OverlayModule, ResizeModule, ArrayModule } from '@ng-utils';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ImageInputModule,
    FormsModule,
    SubstituteModule,
    OverlayModule,
    ResizeModule,
    ArrayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
