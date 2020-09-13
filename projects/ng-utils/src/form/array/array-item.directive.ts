import { Directive, forwardRef, Inject, OnChanges, OnInit, Optional, Self } from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl, NgModel, Validator, ValidatorFn
} from '@angular/forms';

import { setUpControl } from './form-array-utils';

@Directive({
  selector: '[thaArrayItem]',
  providers: [
    {provide: NgControl, useExisting: forwardRef(() => FormArrayItemDirective)}
  ]
})
export class FormArrayItemDirective extends NgModel implements OnInit, OnChanges {
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
  }
}
