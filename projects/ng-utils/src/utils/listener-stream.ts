import { Subject } from 'rxjs';
import { noop } from '@thalesrc/js-utils/function/noop';

const CACHE = new WeakMap();

export function ListenerStream(): PropertyDecorator {
  return (target: any, key: string) => {
    Object.defineProperty(target, key, {
      get() {
        if (!CACHE.has(this)) {
          CACHE.set(this, {});
        }

        const cacheItem = CACHE.get(this);

        if (!(key in cacheItem)) {
          const subject = new Subject();

          cacheItem[key] = new Proxy(noop, {
            get(_, prop) {
              return subject[prop];
            },
            apply(_, __, args: any[]) {
              args.length > 1
                ? subject.next(args)
                : args.length > 0
                ? subject.next(args[0])
                : subject.next();
            }
          });
        }

        return cacheItem[key];
      },
      set() {
        throw new Error('Setting ListenerStream propery is forbidden');
      }
    });
  };
}
