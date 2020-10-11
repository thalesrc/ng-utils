import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageInputModule } from './image-input';
import { FormDisabledDirective } from './directives';
import { ArrayModule } from './array';

const MODULES = [
  CommonModule,
  FormsModule,
  ImageInputModule,
  ArrayModule,
];

const DIRECTIVES = [
  FormDisabledDirective
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...DIRECTIVES,
  ],
  exports: [
    ...MODULES,
    ...DIRECTIVES
  ]
})
export class FormModule { }
