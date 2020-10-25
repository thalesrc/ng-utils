import {
  AfterViewInit, ApplicationRef, ComponentFactoryResolver, Directive, ElementRef, Injector, Input,
  OnDestroy, Optional, TemplateRef, ViewContainerRef
} from '@angular/core';

import { BlockerController } from './blocker-controller';
import { TemplateController } from './template.controller';
import { ViewController } from './view.controller';

@Directive({
  selector: '[thaBlocker]'
})
export class BlockerDirective implements AfterViewInit, OnDestroy {
  private controller: BlockerController;
  // tslint:disable-next-line:variable-name
  private _blocked = false;

  public get blocked(): boolean {
    return this._blocked;
  }

  @Input('clBlocker')
  public set blocked(value: boolean) {
    if (!!value === this.blocked) {
      return;
    }

    if (!!value) {
      this.controller.show();
      this._blocked = true;
    } else {
      this.controller.hide();
      this._blocked = false;
    }
  }

  @Input('clBlockerUse')
  public set template(template: TemplateRef<unknown>) {
    if (!(template instanceof TemplateRef)) {
      template = null;
    }

    this.controller.componentRef.instance.template = template;
  }

  constructor(
    resolver: ComponentFactoryResolver,
    element: ElementRef<HTMLDivElement>,
    appRef: ApplicationRef,
    injector: Injector,
    @Optional() tempRef: TemplateRef<unknown>,
    viewRef: ViewContainerRef
  ) {
    this.controller = tempRef
      ? new TemplateController(element.nativeElement.parentElement, viewRef, resolver)
      : new ViewController(element.nativeElement, resolver, injector, appRef);
  }

  public ngAfterViewInit() {
  }

  public ngOnDestroy() {
    this.controller.destroy();
  }
}
