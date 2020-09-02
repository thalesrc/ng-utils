import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResizeDirective } from './resize.directive';
import { AnimateResizeDirective } from './animate-resize.directive';

@NgModule({
  imports: [
    BrowserAnimationsModule,
  ],
  declarations: [
    ResizeDirective,
    AnimateResizeDirective
  ],
  exports: [
    ResizeDirective,
    AnimateResizeDirective
  ]
})
export class ResizeModule { }
