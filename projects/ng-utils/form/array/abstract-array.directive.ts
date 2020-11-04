import { ControlContainer } from '@angular/forms';
import { ArrayChild } from './array-child';

export abstract class AbstractArrayDirective extends ControlContainer {
  public abstract ownItems: ArrayChild[];
}
