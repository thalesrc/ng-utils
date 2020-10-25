import { Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'tha-blocker',
  templateUrl: './blocker.component.html',
  styleUrls: ['./blocker.component.scss'],
})
export class BlockerComponent {
  public template: TemplateRef<unknown> = null;
}
