import { Directive, forwardRef, Host, Inject, OnInit, Optional, Self, SkipSelf } from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlContainer, FormGroup, NgModelGroup, NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validator, ValidatorFn
} from '@angular/forms';
import { AbstractArrayDirective } from './abstract-array.directive';
import { ArrayChild } from './array-child';

declare const ngDevMode: any;

@Directive({
  selector: '[thaArrayGroup]',
  providers: [
    { provide: ControlContainer, useExisting: forwardRef(() => ArrayGroupDirective) },
    { provide: ArrayChild, useExisting: forwardRef(() => ArrayGroupDirective) }
  ]
})
export class ArrayGroupDirective extends NgModelGroup implements ArrayChild, OnInit {
  // tslint:disable-next-line:variable-name
  public __control = new FormGroup({}, this.__validators as ValidatorFn[], this.__asyncValidators as AsyncValidatorFn[]);

  public get ['control' + ''](): FormGroup {
    return this.__control;
  }

  public get ['path' + '']() {
    return [...this.__parent.path, this.__parent.ownItems.findIndex(item => item === this)] as string[];
  }

  constructor(
    // tslint:disable-next-line:variable-name
    @Host() public __parent: AbstractArrayDirective,
    // tslint:disable-next-line:variable-name
    @Optional() @Self() @Inject(NG_VALIDATORS) private __validators: Array<Validator | ValidatorFn>,
    // tslint:disable-next-line:variable-name
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) private __asyncValidators: Array<AsyncValidator | AsyncValidatorFn>
  ) {
    super(__parent, __validators, __asyncValidators);
  }

  public ngOnInit(): void {
    this._checkParentType();
  }

  protected _checkParentType(): void {
    import('./array.directive').then(({FormArrayDirective}) => {
      if (!(this.__parent instanceof FormArrayDirective) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throw new Error('`thaArrayGroup` should be used in a `thaArray` context');
      }
    });
  }
}
