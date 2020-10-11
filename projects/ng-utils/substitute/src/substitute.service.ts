import { Injectable, TemplateRef } from '@angular/core';
import { SmartMap } from '@thalesrc/js-utils/smart-map';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubstituteService {
  private cache = new SmartMap<any, TemplateRef<unknown>>();

  public templates$ = new BehaviorSubject(this.cache);

  constructor() { }

  public attach(scope: any, template: TemplateRef<unknown>) {
    this.cache.set(scope, template);

    this.templates$.next(this.cache);
  }

  public detach(scope: any) {
    this.cache.delete(scope);

    this.templates$.next(this.cache);
  }
}
