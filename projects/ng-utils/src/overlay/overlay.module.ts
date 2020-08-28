import { OverlayModule as CdkOverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OverlayDirective } from './overlay.directive';
import { OverlayComponent } from './overlay/overlay.component';

@NgModule({
  declarations: [
    OverlayDirective,
    OverlayComponent
  ],
  imports: [
    CommonModule,
    CdkOverlayModule
  ],
  exports: [
    CdkOverlayModule,
    OverlayComponent,
  ]
})
export class OverlayModule { }
