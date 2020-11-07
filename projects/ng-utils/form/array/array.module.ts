import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArrayGroupDirective } from './array-group.directive';
import { ArrayItemDirective } from './array-item.directive';
import { ArrayDirective } from './array.directive';

@NgModule({
  declarations: [
    ArrayDirective,
    ArrayItemDirective,
    ArrayGroupDirective,
  ],
  imports: [
    FormsModule
  ],
  exports: [
    ArrayDirective,
    ArrayItemDirective,
    ArrayGroupDirective,
  ]
})
export class ArrayModule { }
