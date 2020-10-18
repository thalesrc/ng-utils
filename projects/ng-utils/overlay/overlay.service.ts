import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ElementRef, EmbeddedViewRef, Injectable } from '@angular/core';
import { defer } from '@thalesrc/js-utils/legacy';
import { Observable } from 'rxjs';

import { OverlayDirective } from './overlay.directive';

interface RegisterEvent {
  backdropClick: Observable<MouseEvent>;
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private refs = new Map<OverlayDirective<any>, [OverlayRef, EmbeddedViewRef<void>]>();

  constructor(
    private overlay: Overlay
  ) {
  }

  public register<T>(directive: OverlayDirective<T>): RegisterEvent {
    const ref = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true,
    });

    this.refs.set(directive, [ref, null]);

    return {
      backdropClick: ref.backdropClick()
    };
  }

  public open<T>(directive: OverlayDirective<T>): void {
    const [ref] = this.refs.get(directive);
    const portal = new TemplatePortal(directive.template, directive.container);
    const comp = ref.attach(portal);
    // tslint:disable-next-line:no-any
    this.refs.set(directive, [ref, comp as any]);
  }

  public close<T>(directive: OverlayDirective<T>): void {
    const [ref] = this.refs.get(directive);

    ref.detach();

    this.refs.set(directive, [ref, null]);
  }

  /**
   * Close all open overlays
   */
  public closeAll(): void {
    const openedOverlays = [...this.refs.entries()].filter(([, [, view]]) => !!view).map(([directive]) => directive);

    for (const directive of openedOverlays) {
      directive.close();
    }
  }

  public async getHostOverlay<T>(element: ElementRef): Promise<OverlayDirective<T>> {
    await defer();

    const [directive] = [...this.refs.entries()]
      .filter(([, [, comp]]) => !!comp)
      .find(([, [, comp]]) => comp.rootNodes.some(node => node === element.nativeElement));

    return directive as OverlayDirective<T>;
  }
}
