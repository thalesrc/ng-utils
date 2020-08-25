import { BehaviorSubject } from 'rxjs';
import { shareLast } from './share-last';

export function InputStream(startWith = null): PropertyDecorator {
  return (target: any, key: string) => {
    const b = new BehaviorSubject(startWith);
    Object.defineProperty(target, key, {get: () => b.pipe(shareLast()), set: value => b.next(value)});
  };
}
