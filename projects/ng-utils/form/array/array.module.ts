import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrayGroupDirective } from './array-group.directive';
import { FormArrayItemDirective } from './array-item.directive';
import { FormArrayDirective } from './array.directive';

@NgModule({
  declarations: [
    FormArrayDirective,
    FormArrayItemDirective,
    ArrayGroupDirective,
  ],
  imports: [
    FormsModule
  ],
  exports: [
    FormArrayDirective,
    FormArrayItemDirective,
    ArrayGroupDirective,
  ]
})
export class ArrayModule { }
