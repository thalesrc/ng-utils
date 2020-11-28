import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { OverlayDirective } from '../overlay.directive';
import { OpenPromise } from '@thalesrc/js-utils/open-promise';
import { InputStream } from '@thalesrc/ng-utils/utils';
import { Observable, EMPTY } from 'rxjs';
import { map, switchMap, pluck, first } from 'rxjs/operators';

export interface OverlayConfig {
  closeOnBackdropClick?: boolean;
}

const DEFAULT_CONFIG: OverlayConfig = {
  closeOnBackdropClick: true
};

@Component({
  selector: 'tha-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  exportAs: 'thaOverlay'
})
export class OverlayComponent implements AfterViewInit {
  private onReady = new OpenPromise();

  @Input('thaOverlayConfig')
  @InputStream()
  public config: Observable<OverlayConfig>;

  @ViewChild(OverlayDirective, {static: true})
  private directive: OverlayDirective<any>;

  @Output()
  public closed = new EventEmitter<any>();

  @Output()
  public opened = new EventEmitter<void>();

  public ngAfterViewInit() {
    this.onReady.resolve(null);

    const config$ = this.config.pipe(map(config => ({...DEFAULT_CONFIG, ...config})));

    config$.pipe(
      pluck('closeOnBackdropClick'),
      switchMap(closeOnBackdropClick => closeOnBackdropClick ? this.directive.backdropClick$ : EMPTY)
    ).subscribe(() => {
      this.close();
    });
  }

  public async open(): Promise<any> {
    await this.onReady;
    await this.directive.open();
    this.opened.emit();

    return this.closed.pipe(first()).toPromise();
  }

  public async close(event: any = false): Promise<void> {
    await this.onReady;
    this.directive.close();
    this.closed.emit(event);
  }
}
