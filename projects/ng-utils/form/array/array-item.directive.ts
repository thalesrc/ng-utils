import { Directive, forwardRef, Host, Inject, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl, NgModel, Validator, ValidatorFn
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { InputStream } from '@thalesrc/ng-utils/utils';

import { setUpControl } from './form-array-utils';
import { ArrayChild } from './array-child';
import { AbstractArrayDirective } from './abstract-array.directive';

@Directive({
  selector: '[thaArrayItem]',
  providers: [
    {provide: NgControl, useExisting: forwardRef(() => FormArrayItemDirective)},
    {provide: ArrayChild, useExisting: forwardRef(() => FormArrayItemDirective)}
  ],
  exportAs: 'thaArrayItem'
})
export class FormArrayItemDirective extends NgModel implements OnInit, OnDestroy, ArrayChild {
  private onDestroy$ = new Subject();

  @Input('thaArrayItem')
  @InputStream()
  public itemValue$: Observable<any>;

  constructor(
    // tslint:disable-next-line:variable-name
    @Host() public __parent: AbstractArrayDirective,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: Array<Validator|ValidatorFn>,
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<AsyncValidator|AsyncValidatorFn>,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[]
  ) {
    super(null, validators, asyncValidators, valueAccessors);
  }

  private ['_setUpControl' + '']() {
    this['_registered' + ''] = true;

    setUpControl(this.control, this);
  }

  public ngOnInit() {
    this['_setUpControl' + '']();

    this.itemValue$.pipe(distinctUntilChanged(), takeUntil(this.onDestroy$)).subscribe(value => {
      this.control.setValue(value, {emitEvent: true, onlySelf: false});
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
