import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup } from '@angular/forms';
import { noop } from '@thalesrc/js-utils';
import { BehaviorSubject, Subject } from 'rxjs';

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

class ExtendedFormArray extends FormArray implements FormGroup, Omit<FormControl, '_applyFormState'> {
  public controls: any;
  public setControl: any;
  // tslint:disable-next-line:variable-name
  private _applyFormState: any;

  public registerControl(name: string, control: AbstractControl) {
    return control;
  }

  public addControl() {
  }

  public removeControl() {
  }

  public contains(name: string): boolean {
    return true;
  }

  public registerOnChange() {
  }

  public registerOnDisabledChange() {
  }
}

export class ArrayValueAccessor implements ControlValueAccessor {
  private onChange: (v: any) => void = noop;
  private onTouched = noop;
  public array = new ExtendedFormArray([]);
  public destroy$ = new Subject();

  public statusChanges$ = new BehaviorSubject(this.array);

  public writeValue(value: any) {
    value = value || [];

    if (!(value instanceof Array)) {
      throw new Error('Value is not an array');
    }

    this.array.setValue((<[]> this.array.value || []).map((v, i) => value[i] || v || null) , {emitEvent: true});
  }

  public registerOnChange(fn: (v: any) => void) {
    this.onChange = fn;
  }
  public registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean) {
    const method = disabled ? 'disable' : 'enable';

    for (const control of this.array.controls) {
      control[method]();
    }
  }
}
