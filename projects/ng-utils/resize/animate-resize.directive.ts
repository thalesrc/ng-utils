import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AnimationBuilder, AnimationFactory, style, animate } from '@angular/animations';
import { Unsubscriber } from '../utils';
import { ResizeService } from './resize.service';
import { of, merge, interval } from 'rxjs';
import { distinctUntilChanged, takeUntil, mapTo, exhaustMap, take, filter, pairwise } from 'rxjs/operators';
import { ResizeEvent } from '@thalesrc/resize-manager';
import { ResizeMode } from './resize-mode';
import { isTruthy } from '@thalesrc/js-utils/legacy';

@Directive({
  selector: '[thaAnimateResize]',
  exportAs: 'thaAnimateResize'
})
export class AnimateResizeDirective extends Unsubscriber {
  @Input('thaAnimateResize')
  // tslint:disable-next-line:variable-name
  public mode: ResizeMode;

  @Input('duration')
  // tslint:disable-next-line:variable-name
  public _duration: number;

  @Output()
  public animationComplete = new EventEmitter<void>();

  private get duration(): number {
    return Number.isNaN(+this._duration) ? 180 : +this._duration;
  }

  constructor(
    service: ResizeService,
    {nativeElement}: ElementRef,
    builder: AnimationBuilder
  ) {
    super();

    service.observe(nativeElement, 0).pipe(
      distinctUntilChanged(({width, height}, next) => {
        switch (this.mode) {
          case 'width':
            return width === next.width;
          case 'height':
            return height === next.height;
          default:
            return width === next.width && height === next.height;
        }
      }),
      pairwise(),
      exhaustMap(event =>
        merge(
          of(null).pipe(mapTo(event)),
          interval(this.duration + 100).pipe(mapTo(null))
        ).pipe(take(2))),
      filter<[ResizeEvent, ResizeEvent]>(isTruthy),
      takeUntil(this.onDestroy$)
    ).subscribe(([prev, {width, height}]) => {
      let factory: AnimationFactory;

      switch (this.mode) {
        case 'width':
          factory = builder.build([style({width: prev.width}), animate(this.duration, style({width}))]);
          break;
        case 'height':
          factory = builder.build([style({height: prev.height}), animate(this.duration, style({height}))]);
          break;
        default:
          factory = builder.build([style({width: prev.width, height: prev.height}), animate(this.duration, style({width, height}))]);
      }

      const player = factory.create(nativeElement);

      player.play();

      player.onDone(() => {
        player.destroy();
        this.animationComplete.emit();
      });
    });
  }
}
