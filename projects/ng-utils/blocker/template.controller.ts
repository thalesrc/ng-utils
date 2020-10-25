import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';

import { BlockerController } from './blocker-controller';
import { BlockerComponent } from './blocker.component';

export class TemplateController extends BlockerController {
  public componentRef: ComponentRef<BlockerComponent>;

  constructor(
    parent: HTMLElement,
    private viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver
  ) {
    super(parent);

    const factory = resolver.resolveComponentFactory(BlockerComponent);
    this.componentRef = factory.create(viewRef.injector);
  }

  public show() {
    this.setStyle();
    this.viewRef.insert(this.componentRef.hostView);
  }

  public hide() {
    this.removeStyle();
    this.viewRef.remove();
  }

  public destroy() {
  }
}
