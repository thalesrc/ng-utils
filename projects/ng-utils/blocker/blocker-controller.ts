import { ComponentRef } from '@angular/core';

import { BlockerComponent } from './blocker.component';

export abstract class BlockerController {
  private relativeInserted = false;
  private hiddenInserted = false;

  public abstract componentRef: ComponentRef<BlockerComponent>;

  constructor(
    protected parentNode: HTMLElement
  ) { }

  public abstract show(): void;
  public abstract hide(): void;
  public abstract destroy(): void;

  protected setStyle() {
    const style = getComputedStyle(this.parentNode);

    if (style.position === 'static') {
      this.parentNode.style.setProperty('position', 'relative');
      this.relativeInserted = true;
    }

    if (style.overflow === 'visible') {
      this.parentNode.style.setProperty('overflow', 'hidden');
      this.hiddenInserted = true;
    }
  }

  protected removeStyle() {
    if (this.relativeInserted) {
      this.parentNode.style.removeProperty('position');
      this.relativeInserted = false;
    }

    if (this.hiddenInserted) {
      this.parentNode.style.removeProperty('overflow');
      this.hiddenInserted = false;
    }
  }
}
