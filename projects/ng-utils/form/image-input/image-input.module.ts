import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ImageInputDirective } from './image-input.directive';

@NgModule({
  declarations: [
    ImageInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ImageInputDirective
  ]
})
export class ImageInputModule { }
