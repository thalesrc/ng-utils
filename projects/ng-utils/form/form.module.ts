import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageInputModule } from './image-input';
import { FormDisabledDirective } from './directives';
import { ArrayModule } from './array';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageInputModule,
    ArrayModule,
  ],
  declarations: [
    FormDisabledDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ImageInputModule,
    ArrayModule,
    FormDisabledDirective
  ]
})
export class FormModule { }
