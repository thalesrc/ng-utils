import { Directive, EventEmitter, OnDestroy, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { defer } from '@thalesrc/js-utils/legacy';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { OverlayService } from './overlay.service';

@Directive({
  selector: '[thaOverlay]',
  exportAs: 'thaOverlay'
})
export class OverlayDirective<T> implements OnDestroy {
  private subs = new Subscription();

  public backdropClick$: Observable<MouseEvent>;
  public controller: T = null;

  @Output()
  public backdropClick = new EventEmitter<void>();

  // tslint:disable-next-line:variable-name
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  public isOpen$ = this._isOpen$.asObservable();

  constructor(
    private service: OverlayService,
    public template: TemplateRef<unknown>,
    public container: ViewContainerRef
  ) {
    const {backdropClick} = service.register(this);

    this.backdropClick$ = backdropClick;
    this.subs.add(this.backdropClick$.subscribe(() => this.backdropClick.emit()));
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public async open(): Promise<T> {
    this.service.open(this);
    this._isOpen$.next(true);

    await defer();

    return this.controller;
  }

  public close(): void {
    this.service.close(this);
    this._isOpen$.next(false);
  }
}
