import { Directive, Host, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { difference } from '@thalesrc/js-utils/array/difference';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { InputStream, Unsubscriber } from '@thalesrc/ng-utils/utils';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'form:not([ngNoForm]):not([formGroup])[disabled], ng-form[disabled], [ng-form][disabled]',
  exportAs: 'thaDisabled'
})
export class FormDisabledDirective extends Unsubscriber {
  // tslint:disable-next-line:no-input-rename
  @Input('disabled')
  @InputStream(false)
  private disabled$: Observable<boolean>;

  constructor(
    @Host() form: NgForm
  ) {
    super();

    const controls$ = form.valueChanges.pipe(
      map(Object.keys),
      distinctUntilChanged((oldKeys, newKeys) => !difference(oldKeys, newKeys).length),
      map(() => Object.values(form.controls))
    );

    const disabled$ = this.disabled$.pipe(
      map((value: unknown) => value === ''
        ? true
        : value === 'false'
        ? false
        : !!value)
    );

    combineLatest([controls$, disabled$]).pipe(takeUntil(this.onDestroy$)).subscribe(([controls, readonly]) => {
      const method = readonly ? 'disable' : 'enable';

      for (const control of controls) {
        control[method]();
      }
    });
  }
}
