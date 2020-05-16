import { MonoTypeOperatorFunction } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function shareLast<T>(): MonoTypeOperatorFunction<T> {
  return shareReplay({refCount: false, bufferSize: 1});
}
