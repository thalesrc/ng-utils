import { NgModule } from '@angular/core';
import { ResizeDirective } from './resize.directive';
import { AnimateResizeDirective } from './animate-resize.directive';

@NgModule({
  imports: [
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
