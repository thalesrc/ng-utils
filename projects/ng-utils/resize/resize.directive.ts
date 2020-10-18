import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Unsubscriber, InputStream } from '@thalesrc/ng-utils/utils';
import { ResizeService } from './resize.service';
import { Observable } from 'rxjs';
import { combineLatest, map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ResizeEvent } from '@thalesrc/resize-manager';
import { ResizeMode } from './resize-mode';

@Directive({
  selector: '[thaResize]',
  exportAs: 'thaResize'
})
export class ResizeDirective extends Unsubscriber {
  @Input('thaResize')
  @InputStream('both')
  public mode: Observable<ResizeMode>;

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onResize = new EventEmitter<ResizeEvent | number>();

  constructor(
    service: ResizeService,
    {nativeElement}: ElementRef
  ) {
    super();

    service.observe(nativeElement, 0).pipe(
      combineLatest(this.mode.pipe(
        map(mode => mode || 'both'),
        distinctUntilChanged()
      )),
      takeUntil(this.onDestroy$)
    ).subscribe(([{width, height}, mode]) => {
      this.onResize.emit(mode === 'both' ? {width, height} : mode === 'width' ? width : height);
    });
  }
}
