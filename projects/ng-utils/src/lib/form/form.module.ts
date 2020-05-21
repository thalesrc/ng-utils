import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageInputModule } from './image-input';

const MODULES = [
  CommonModule,
  FormsModule,
  ImageInputModule,
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
  ]
})
export class FormModule { }
