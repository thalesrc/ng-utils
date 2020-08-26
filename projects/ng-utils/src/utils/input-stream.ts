import { BehaviorSubject } from 'rxjs';
import { shareLast } from './share-last';

export function InputStream(startWith = null): PropertyDecorator {
  return (target: any, key: string) => {
    const subject = new BehaviorSubject(startWith);
    const getter = subject.pipe(shareLast());

    Object.defineProperty(target, key, {get: () => getter, set: value => subject.next(value)});
  };
}
