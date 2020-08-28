# NgUtils

A package to store commonly used angular application contents

[![npm](https://img.shields.io/npm/v/@thalesrc/ng-utils.svg)](https://www.npmjs.com/package/@thalesrc/ng-utils)
[![npm](https://img.shields.io/npm/dw/@thalesrc/ng-utils.svg)](https://www.npmjs.com/package/@thalesrc/ng-utils)
[![npm](https://img.shields.io/npm/l/@thalesrc/ng-utils.svg)](https://github.com/thalesrc/ng-utils/blob/master/LICENSE)

## Advanced Route

Advanced route implementations

### AdvancedRouteService

Contains observables of developer friendly route data

* `routeChange$`: Emits activated route on route change
* `deepestRoute$`: Emits deepest route on route change
* `activeRoutes$`: Emits all active routes (from root to deepest child) on route change
* `params$`: Emits route parameters on route change
* `segments$`: Emits route segments
* `data$`: Emits route data

Usage:

Requires injection at root component
```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    advancedRoute: AdvancedRouteService
  ) {}
}
```
Then, anywhere else
```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent {
  constructor(
    private advancedRoute: AdvancedRouteService
  ) {
    this.advancedRoute.segments$.subscribe(segments => {
      ...
    });
  }
}
```

## Form

Additional form components, directives, validators etc.

### Image Input

Makes a form component from an img element 

Usage:
```html
<form>
  <img thaImageInput [src]="(user$ | async)?.avatar || 'assets/img/avatar.png'" ngModel name="avatar">
</form>
```

Trigger openning selection by another element

```html
<form>
  <img [thaImageInput]="{button: imgBtn}" [src]="(user$ | async)?.avatar || 'assets/img/avatar.png'" ngModel name="avatar">
  <button type="button" #imgBtn>Change Image</button>
</form>
```

## Overlay

Create your own custom modals, dialogs etc.

### OverlayComponent

`tha-overlay` component comes with no styling except cdk prebuilt styles. It contains only the open/close functionality based on `CdkOverlay` so feel free to use it with your other `CdkOverlay` based components.

* `exportAs`: 'thaOverlay'
* `open()`: Open the modal
  *  _[Returns] A promise which emits the value set on close_
* `close(event: any)`: Closes the modal by emitting a value
  * [Arg] `event`: the value to emit (default false)
* `(closed)`: [EventEmitter] Emits the values set when it closed _(Emits `false` when no value is set or if it's closed by backdrop click)_

Usage:
```scss
// style.scss
@import '~@angular/cdk/overlay-prebuilt.css';
```

```html
<!-- component.html -->
<button (click)="modal.open()">Open Modal</button>

<tha-overlay #modal>
  <div>My custom content</div>
  <button (click)="modal.close()">Cancel</button>
  <button (click)="modal.close({foo: true})">Submit</button>
</tha-overlay>
```

## Substitute

Create portals in components and manage it from outside

### SubstituteComponent

Create a reference point inside a component to make another component fill and manage it 

Usage:
```html
<header>
  <img src="logo.png">
  <tha-substitute thaSubstituteScope="header"></tha-substitute>
</header>
```

### SubstituteDirective

Fill a portal in another component with html and manage it from inside your component

Usage:
```html
<h1>My Panel</h1>
<div class="links" *thaSubstitute="'header'">
  <a *ngFor="let link of links" [routerLink]="link.url"> {{link.text}}</a>
</div>
```

## Utils

### InputStream

Convert an `@Input()` into a stream of data. The prop turns into an observable and emits on every change.

Usage:
```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit {
  @Input()
  @InputStream()
  public bar: Observable<number>;

  ngOnInit() {
    this.bar.subscribe(num => {
      console.log(num);
    });
  }
}
```

### ListenerStream

Convert an `@HostListener()` into a stream of data. The prop turns into an observable and emits on every event.

Usage:
```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit {
  @HostListener('click', ['$event'])
  @ListenerStream()
  public bar: Observable<MouseEvent>;

  ngOnInit() {
    this.bar.subscribe(event => {
      console.log(event);
    });
  }
}
```

### Unsubscriber

Provides some properties into your components to make managing rxjs observables much secure on destroy.

* `subs` (setter): set your subscription into this prop to make it unsubscribe when the component destroyed
* `onDestroy$`: emits and completes when the component destroyed

_Note: If you have to use `ngOnDestroy` method of a component on `Unsubscriber` extended, use `super.ngOnDestroy();` in `ngOnDestroy` method to keep the functionality of `Unsubscriber`_

Usage:
```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent extends Unsubscriber {
  public data$ = this.service.data$.pipe(takeUntil(this.onDestroy$));
  public foo$ = this.service.foo$;

  constructor(private service: FooService) {
    super();

    this.subs = this.foo$.subscribe(foo => {
      ...
    });
  }
}
```
