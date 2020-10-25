import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlockerComponent } from './blocker.component';
import { BlockerDirective } from './blocker.directive';
import { DefaultComponent } from './default/default.component';


@NgModule({
  declarations: [
    BlockerDirective,
    BlockerComponent,
    DefaultComponent
  ],
  entryComponents: [
    BlockerComponent,
    DefaultComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BlockerDirective,
  ]
})
export class BlockerModule { }
