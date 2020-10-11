import { BehaviorSubject } from 'rxjs';
import { shareLast } from './share-last';

const CACHE = new WeakMap();

function checkCacheItem(instance: any, key: string, startWith: any) {
  if (!CACHE.has(instance)) {
    CACHE.set(instance, {});
  }

  const cacheItem = CACHE.get(instance);

  if (!(key in cacheItem)) {
    const source = new BehaviorSubject(startWith);

    cacheItem[key] = {source, shared: source.pipe(shareLast())};
  }

  return cacheItem[key];
}

export function InputStream(startWith = null): PropertyDecorator {
  return (target: any, key: string) => {

    Object.defineProperty(target, key, {
      get() {
        return checkCacheItem(this, key, startWith).shared;
      },
      set(value) {
        const { source } = checkCacheItem(this, key, startWith);

        source.next(value);
      }
    });
  };
}
