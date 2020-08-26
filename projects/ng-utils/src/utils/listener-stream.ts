import { Subject } from 'rxjs';

export function ListenerStream(): PropertyDecorator {
  return (target: any, key: string) => {
    const subject = new Subject();

    function handler(...args: any[]) {
      switch (args.length) {
        case 0:
          subject.next();
          break;
        case 1:
          subject.next(args[0]);
          break;
        default:
          subject.next(args);
      }
    }

    target[key] = new Proxy(handler, {
      get(_, prop) {
        return subject[prop];
      },
      apply(_, __, args: any[]) {
        return handler(...args);
      }
    });
  };
}
