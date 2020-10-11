import { Directive, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl, NgModel, Validator, ValidatorFn
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { InputStream } from '../../../utils.entry';

import { setUpControl } from './form-array-utils';

@Directive({
  selector: '[thaArrayItem]',
  providers: [
    {provide: NgControl, useExisting: forwardRef(() => FormArrayItemDirective)}
  ],
  exportAs: 'thaArrayItem'
})
export class FormArrayItemDirective extends NgModel implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();

  @Input('thaArrayItem')
  @InputStream()
  public itemValue$: Observable<any>;

  constructor(
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
