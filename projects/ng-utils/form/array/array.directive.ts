import {
  AfterContentInit, ContentChildren, Directive, forwardRef, Host, Inject, Input, OnDestroy, Optional, QueryList, Self, SkipSelf
} from '@angular/core';
import {
  AsyncValidator, AsyncValidatorFn, ControlContainer, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NgControl, NgModel, Validator, ValidatorFn,
  FormControl
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { InputStream } from '@thalesrc/ng-utils/utils';

import { ArrayValueAccessor } from './array-value-accessor';
import { ArrayChild } from './array-child';
import { AbstractArrayDirective } from './abstract-array.directive';

@Directive({
  selector: '[thaArrayModel]',
  providers: [
    {provide: NgControl, useExisting: forwardRef(() => FormArrayDirective)},
    {provide: ControlContainer, useExisting: forwardRef(() => FormArrayDirective)},
    {provide: AbstractArrayDirective, useExisting: forwardRef(() => FormArrayDirective)}
  ],
  exportAs: 'thaArrayModel'
})
export class FormArrayDirective extends NgModel implements AfterContentInit, OnDestroy, ControlContainer, AbstractArrayDirective {
  private onDestroy$ = new Subject();

  public valueAccessor: ArrayValueAccessor;

  @ContentChildren(ArrayChild, {descendants: true})
  private items: QueryList<ArrayChild>;

  public get ownItems() {
    return this.items.toArray().filter(item => item.__parent === this);
  }

  @Input()
  public name: string;

  @Input('thaArrayModel')
  @InputStream()
  public modelValue$: Observable<any[]>;

  public get ['control' + ''](): FormControl {
    return this.valueAccessor.array as any;
  }

  public set ['control' + ''](control: any) {}

  constructor(
    @Optional() @Host() @SkipSelf() parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: Array<Validator|ValidatorFn>,
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<AsyncValidator|AsyncValidatorFn>
  ) {
    super(parent, validators, asyncValidators, [new ArrayValueAccessor()]);
  }

  public ngAfterContentInit() {
    this.items.changes.pipe(
      startWith(null),
      map(() => this.ownItems),
      takeUntil(this.onDestroy$)
    ).subscribe(items => {
      this.valueAccessor.array.clear();

      for (const [index, item] of items.entries()) {
        this.valueAccessor.array.insert(index, item.control);
      }
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
