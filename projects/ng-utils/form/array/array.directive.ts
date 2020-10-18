import {
  AfterContentInit, ContentChildren, Directive, forwardRef, Host, Inject, Input, OnDestroy, Optional, QueryList, Self
} from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlContainer, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NgControl, NgModel, Validator, ValidatorFn
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

import { ArrayValueAccessor } from './array-value-accessor';
import { FormArrayItemDirective } from './array-item.directive';
import { InputStream } from '@thalesrc/ng-utils/utils';

@Directive({
  selector: '[thaArrayModel]',
  providers: [
    {provide: NgControl, useExisting: forwardRef(() => FormArrayDirective)}
  ],
  exportAs: 'thaArrayModel'
})
export class FormArrayDirective extends NgModel implements AfterContentInit, OnDestroy {
  private onDestroy$ = new Subject();

  public valueAccessor: ArrayValueAccessor;

  @ContentChildren(FormArrayItemDirective, {descendants: true})
  private items: QueryList<FormArrayItemDirective>;

  @Input()
  public name: string;

  @Input('thaArrayModel')
  @InputStream()
  public modelValue$: Observable<any[]>;

  constructor(
    @Optional() @Host() parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: Array<Validator|ValidatorFn>,
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<AsyncValidator|AsyncValidatorFn>
  ) {
    super(parent, validators, asyncValidators, [new ArrayValueAccessor()]);
  }

  public ngAfterContentInit() {
    this.items.changes.pipe(startWith(null), map(() => this.items.toArray()), takeUntil(this.onDestroy$)).subscribe(items => {
      this.valueAccessor.array.clear();

      for (const [index, item] of items.entries()) {
        this.valueAccessor.array.insert(index, item.control);
      }
    });

    this.valueAccessor.statusChanges$.pipe(takeUntil(this.onDestroy$)).subscribe(array => {
      this.control.setErrors(array.errors);
    });

    this.modelValue$.pipe(
      distinctUntilChanged(),
      takeUntil(this.onDestroy$)
    ).subscribe(value => {
      value = value || [];

      if (!(value instanceof Array)) {
        throw new Error('Value is not an array');
      }

      this.control.setValue(
        (<[]> this.valueAccessor.array.value || []).map((v, i) => value[i] || v || null),
        {emitEvent: true, emitModelToViewChange: true}
      );
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();

    this.onDestroy$.next();
    this.onDestroy$.complete();

    this.valueAccessor.destroy$.next();
    this.valueAccessor.destroy$.complete();
  }
}
