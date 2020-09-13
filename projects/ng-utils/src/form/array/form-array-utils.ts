/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { isDevMode } from '@angular/core';
import {
  AbstractControl, AbstractControlDirective, AbstractFormGroupDirective, AsyncValidator, AsyncValidatorFn, CheckboxControlValueAccessor,
  ControlContainer, ControlValueAccessor, DefaultValueAccessor, FormArray, FormArrayName, FormControl, FormGroup, NgControl,
  NumberValueAccessor, RadioControlValueAccessor, RangeValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor,
  Validator, ValidatorFn, Validators
} from '@angular/forms';

const ngDevMode = true;


export function controlPath(name: string|null, parent: ControlContainer): string[] {
  return [...parent.path, name];
}

export function setUpControl(control: FormControl, dir: NgControl): void {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (!control) { _throwError(dir, 'Cannot find control with'); }
    if (!dir.valueAccessor) { _throwError(dir, 'No value accessor for form control with'); }
  }

  control.validator = Validators.compose([control.validator, dir.validator]);
  control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
  dir.valueAccessor.writeValue(control.value);

  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);

  setUpBlurPipeline(control, dir);

  if (dir.valueAccessor.setDisabledState) {
    control.registerOnDisabledChange((isDisabled: boolean) => {
      dir.valueAccessor.setDisabledState(isDisabled);
    });
  }

  // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
  dir['_rawValidators' + ''].forEach((validator: Validator|ValidatorFn) => {
    if ((<Validator> validator).registerOnValidatorChange) {
      (<Validator> validator).registerOnValidatorChange(() => control.updateValueAndValidity());
    }
  });

  dir['_rawAsyncValidators' + ''].forEach((validator: AsyncValidator|AsyncValidatorFn) => {
    if ((<Validator> validator).registerOnValidatorChange) {
      (<Validator> validator).registerOnValidatorChange(() => control.updateValueAndValidity());
    }
  });
}

export function cleanUpControl(control: FormControl, dir: NgControl) {
  const noop = () => {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      _noControlError(dir);
    }
  };

  dir.valueAccessor.registerOnChange(noop);
  dir.valueAccessor.registerOnTouched(noop);

  dir['_rawValidators' + ''].forEach((validator: any) => {
    if (validator.registerOnValidatorChange) {
      validator.registerOnValidatorChange(null);
    }
  });

  dir['_rawAsyncValidators' + ''].forEach((validator: any) => {
    if (validator.registerOnValidatorChange) {
      validator.registerOnValidatorChange(null);
    }
  });

  if (control) { control['_clearChangeFns' + ''](); }
}

function setUpViewChangePipeline(control: FormControl, dir: NgControl): void {
  dir.valueAccessor.registerOnChange((newValue: any) => {
    control['_pendingValue' + ''] = newValue;
    control['_pendingChange' + ''] = true;
    control['_pendingDirty' + ''] = true;

    if (control.updateOn === 'change') { updateControl(control, dir); }
  });
}

function setUpBlurPipeline(control: FormControl, dir: NgControl): void {
  dir.valueAccessor.registerOnTouched(() => {
    control['_pendingTouched' + ''] = true;

    if (control.updateOn === 'blur' && control['_pendingChange' + '']) { updateControl(control, dir); }
    if (control.updateOn !== 'submit') { control.markAsTouched(); }
  });
}

function updateControl(control: FormControl, dir: NgControl): void {
  if (control['_pendingDirty' + '']) { control.markAsDirty(); }
  control.setValue(control['_pendingValue' + ''], {emitModelToViewChange: false});
  dir.viewToModelUpdate(control['_pendingValue' + '']);
  control['_pendingChange' + ''] = false;
}

function setUpModelChangePipeline(control: FormControl, dir: NgControl): void {
  control.registerOnChange((newValue: any, emitModelEvent: boolean) => {
    // control -> view
    dir.valueAccessor.writeValue(newValue);

    // control -> ngModel
    if (emitModelEvent) { dir.viewToModelUpdate(newValue); }
  });
}

export function setUpFormContainer(
    control: FormGroup|FormArray, dir: AbstractFormGroupDirective|FormArrayName) {
  if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
    _throwError(dir, 'Cannot find control with');
  }
  control.validator = Validators.compose([control.validator, dir.validator]);
  control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}

function _noControlError(dir: NgControl) {
  return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}

function _throwError(dir: AbstractControlDirective, message: string): void {
  let messageEnd: string;
  if (dir.path.length > 1) {
    messageEnd = `path: '${dir.path.join(' -> ')}'`;
  } else if (dir.path[0]) {
    messageEnd = `name: '${dir.path}'`;
  } else {
    messageEnd = 'unspecified name attribute';
  }
  throw new Error(`${message} ${messageEnd}`);
}

export function composeValidators(validators: Array<Validator|ValidatorFn>): ValidatorFn|null {
  return validators != null ? Validators.compose(normalizeValidators<ValidatorFn>(validators)) :
                              null;
}

export function composeAsyncValidators(validators: Array<AsyncValidator|AsyncValidatorFn>):
    AsyncValidatorFn|null {
  return validators != null ?
      Validators.composeAsync(normalizeValidators<AsyncValidatorFn>(validators)) :
      null;
}

export function isPropertyUpdated(changes: {[key: string]: any}, viewModel: any): boolean {
  if (!changes.hasOwnProperty('model')) { return false; }
  const change = changes.model;

  if (change.isFirstChange()) { return true; }
  return !Object.is(viewModel, change.currentValue);
}

const BUILTIN_ACCESSORS = [
  CheckboxControlValueAccessor,
  RangeValueAccessor,
  NumberValueAccessor,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  RadioControlValueAccessor,
];

export function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean {
  return BUILTIN_ACCESSORS.some(a => valueAccessor.constructor === a);
}

export function syncPendingControls(form: FormGroup, directives: NgControl[]): void {
  form['_syncPendingControls' + '']();
  directives.forEach(dir => {
    const control = dir.control as FormControl;
    if (control.updateOn === 'submit' && control['_pendingChange' + '']) {
      dir.viewToModelUpdate(control['_pendingValue' + '']);
      control['_pendingChange' + ''] = false;
    }
  });
}

// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(
    dir: NgControl, valueAccessors: ControlValueAccessor[]): ControlValueAccessor|null {
  if (!valueAccessors) { return null; }

  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
    _throwError(dir, 'Value accessor was not provided as an array for form control with');
  }

  let defaultAccessor: ControlValueAccessor|undefined;
  let builtinAccessor: ControlValueAccessor|undefined;
  let customAccessor: ControlValueAccessor|undefined;

  valueAccessors.forEach((v: ControlValueAccessor) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;

    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        _throwError(dir, 'More than one built-in value accessor matches form control with');
      }
      builtinAccessor = v;

    } else {
      if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        _throwError(dir, 'More than one custom value accessor matches form control with');
      }
      customAccessor = v;
    }
  });

  if (customAccessor) { return customAccessor; }
  if (builtinAccessor) { return builtinAccessor; }
  if (defaultAccessor) { return defaultAccessor; }

  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    _throwError(dir, 'No valid value accessor for form control with');
  }
  return null;
}

export function removeDir<T>(list: T[], el: T): void {
  const index = list.indexOf(el);
  if (index > -1) { list.splice(index, 1); }
}

// TODO(kara): remove after deprecation period
export function _ngModelWarning(
    name: string, type: {_ngModelWarningSentOnce: boolean},
    instance: {_ngModelWarningSent: boolean}, warningConfig: string|null) {
  if (!isDevMode() || warningConfig === 'never') { return; }

  if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
      (warningConfig === 'always' && !instance._ngModelWarningSent)) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      ReactiveErrors.ngModelWarning(name);
    }
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}

function normalizeValidators<V>(validators: (V|Validator|AsyncValidator)[]): V[] {
  return validators.map(validator => {
    return isValidatorFn<V>(validator) ?
        validator :
        ((c: AbstractControl) => validator.validate(c)) as unknown as V;
  });
}

function isValidatorFn<V>(validator: V|Validator|AsyncValidator): validator is V {
  return !(validator as Validator).validate;
}

// tslint:disable-next-line:variable-name
export const Examples = {
  formControlName: `
    <div [formGroup]="myGroup">
      <input formControlName="firstName">
    </div>
    In your class:
    this.myGroup = new FormGroup({
       firstName: new FormControl()
    });`,

  formGroupName: `
    <div [formGroup]="myGroup">
       <div formGroupName="person">
          <input formControlName="firstName">
       </div>
    </div>
    In your class:
    this.myGroup = new FormGroup({
       person: new FormGroup({ firstName: new FormControl() })
    });`,

  formArrayName: `
    <div [formGroup]="myGroup">
      <div formArrayName="cities">
        <div *ngFor="let city of cityArray.controls; index as i">
          <input [formControlName]="i">
        </div>
      </div>
    </div>
    In your class:
    this.cityArray = new FormArray([new FormControl('SF')]);
    this.myGroup = new FormGroup({
      cities: this.cityArray
    });`,

  ngModelGroup: `
    <form>
       <div ngModelGroup="person">
          <input [(ngModel)]="person.name" name="firstName">
       </div>
    </form>`,

  ngModelWithFormGroup: `
    <div [formGroup]="myGroup">
       <input formControlName="firstName">
       <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
    </div>
  `
};

export class ReactiveErrors {
  public static controlParentException(): void {
    throw new Error(
        `formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup
       directive and pass it an existing FormGroup instance (you can create one in your class).
      Example:
      ${Examples.formControlName}`);
  }

  public static ngModelGroupException(): void {
    throw new Error(
        `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
       that also have a "form" prefix: formGroupName, formArrayName, or formGroup.
       Option 1:  Update the parent to be formGroupName (reactive form strategy)
        ${Examples.formGroupName}
        Option 2: Use ngModel instead of formControlName (template-driven strategy)
        ${Examples.ngModelGroup}`);
  }

  public static missingFormException(): void {
    throw new Error(`formGroup expects a FormGroup instance. Please pass one in.
       Example:
       ${Examples.formControlName}`);
  }

  public static groupParentException(): void {
    throw new Error(
        `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).
      Example:
      ${Examples.formGroupName}`);
  }

  public static arrayParentException(): void {
    throw new Error(
        `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
       directive and pass it an existing FormGroup instance (you can create one in your class).
        Example:
        ${Examples.formArrayName}`);
  }

  public static disabledAttrWarning(): void {
    console.warn(`
      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
      you. We recommend using this approach to avoid 'changed after checked' errors.
      Example:
      form = new FormGroup({
        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
        last: new FormControl('Drew', Validators.required)
      });
    `);
  }

  public static ngModelWarning(directiveName: string): void {
    console.warn(`
    It looks like you're using ngModel on the same form field as ${directiveName}.
    Support for using the ngModel input property and ngModelChange event with
    reactive form directives has been deprecated in Angular v6 and will be removed
    in a future version of Angular.
    For more information on this, see our API docs here:
    https://angular.io/api/forms/${
        directiveName === 'formControl' ? 'FormControlDirective' :
                                          'FormControlName'}#use-with-ngmodel
    `);
  }
}
