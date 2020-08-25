import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubstituteComponent } from './substitute.component';
import { SubstituteDirective } from './substitute.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SubstituteComponent,
    SubstituteDirective
  ],
  exports: [
    SubstituteComponent,
    SubstituteDirective
  ]
})
export class SubstituteModule { }
