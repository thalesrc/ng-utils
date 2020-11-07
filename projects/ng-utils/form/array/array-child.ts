import { AbstractControl } from '@angular/forms';
import { AbstractArrayDirective } from './abstract-array.directive';

export abstract class ArrayChild {
  abstract control: AbstractControl;

  // tslint:disable-next-line:variable-name
  abstract __parent: AbstractArrayDirective;
}
