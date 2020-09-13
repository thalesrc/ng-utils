import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormArrayItemDirective } from './array-item.directive';
import { FormArrayDirective } from './array.directive';

@NgModule({
  declarations: [
    FormArrayDirective,
    FormArrayItemDirective,
  ],
  imports: [
    FormsModule
  ],
  exports: [
    FormArrayDirective,
    FormArrayItemDirective
  ]
})
export class ArrayModule { }
