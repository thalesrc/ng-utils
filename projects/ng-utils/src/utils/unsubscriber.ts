import { OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

const SUBS = Symbol('Subscriptions');

export abstract class Unsubscriber implements OnDestroy {
  private [SUBS] = new Subscription();

  protected onDestroy$: Observable<void> = new Subject();

  protected set subs(subscription: Subscription) {
    this[SUBS].add(subscription);
  }

  public ngOnDestroy() {
    (this.onDestroy$ as Subject<void>).next();
    (this.onDestroy$ as Subject<void>).complete();

    this[SUBS].unsubscribe();
  }
}
