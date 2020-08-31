
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { isTruthy } from '@thalesrc/js-utils/is-truthy';
import { deepest } from '@thalesrc/js-utils/object/deepest';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { shareLast } from '../utils/share-last';


@Injectable({
  providedIn: 'root'
})
export class AdvancedRouteService {
  /**
   * Emits activated route on route change
   */
  public routeChange$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd), startWith(null), shareLast());

  /**
   * Emits deepest route on route change
   */
  public deepestRoute$ = this.routeChange$.pipe(map(() => deepest(this.route, 'firstChild')), shareLast());

  /**
   * Emits all active routes (from root to deepest child) on route change
   */
  public activeRoutes$ = this.deepestRoute$.pipe(map(r => r.pathFromRoot), shareLast());

  /**
   * Emits route parameters on route change
   */
  public params$: Observable<Params> = this.activeRoutes$.pipe(
    map(routes => routes.map(r => r.snapshot)),
    map(routes => routes.filter(r => !!r).map(r => r.params)),
    map(params => params.reduce((obj, next) => ({...obj, ...next}), {})),
    shareLast()
  );

  /**
   * Emits route segments ()
   */
  public segments$ = this.activeRoutes$.pipe(
    map(routes => routes.map(r => r.snapshot)),
    map(routes => routes.map(r => r.url[0])),
    map(segments => segments.filter(s => !!s)),
    map(segments => segments.map(s => s.path)),
    shareLast()
  );

  /**
   * Emits route data
   */
  public data$ = this.activeRoutes$.pipe(
    map(routes => routes.map(({snapshot}) => snapshot)),
    map(routes => routes.filter(isTruthy)),
    map(routes => routes.map(({data}) => data)),
    shareLast()
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }
}
