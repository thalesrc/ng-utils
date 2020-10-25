import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injector } from '@angular/core';

import { BlockerController } from './blocker-controller';
import { BlockerComponent } from './blocker.component';

export class ViewController extends BlockerController {
  public componentRef: ComponentRef<BlockerComponent>;

  private get rootNode() {
    return (<EmbeddedViewRef<unknown>>this.componentRef.hostView).rootNodes[0];
  }

  constructor(
    parent: HTMLElement,
    resolver: ComponentFactoryResolver,
    injector: Injector,
    appRef: ApplicationRef
  ) {
    super(parent);

    const factory = resolver.resolveComponentFactory(BlockerComponent);
    this.componentRef = factory.create(injector);

    appRef.attachView(this.componentRef.hostView);
  }

  public show() {
    this.setStyle();
    this.parentNode.appendChild(this.rootNode);
  }

  public hide() {
    this.removeStyle();
    this.parentNode.removeChild(this.rootNode);
  }

  public destroy() {
    this.componentRef.destroy();
  }
}
