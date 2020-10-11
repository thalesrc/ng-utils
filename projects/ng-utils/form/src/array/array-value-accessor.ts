import { ControlValueAccessor, FormArray } from '@angular/forms';
import { noop } from '@thalesrc/js-utils/legacy';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class ArrayValueAccessor implements ControlValueAccessor {
  private onChange: (v: any) => void = noop;
  private onTouched = noop;
  public array = new FormArray([]);
  public destroy$ = new Subject();

  public statusChanges$ = new BehaviorSubject(this.array);

  constructor() {
    this.array.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
    });

    this.array.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(status => {
      if (status === 'VALID') {
        this.array.setErrors(null, {emitEvent: false});
      } else {
        this.array.setErrors(this.array.controls.map(({errors}) => errors), {emitEvent: false});
      }

      this.statusChanges$.next(this.array);
    });
  }

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
