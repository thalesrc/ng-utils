# NgUtils

A package to store commonly used angular application contents

[![npm](https://img.shields.io/npm/v/@thalesrc/ng-utils.svg)](https://www.npmjs.com/package/@thalesrc/ng-utils)
[![npm](https://img.shields.io/npm/dw/@thalesrc/ng-utils.svg)](https://www.npmjs.com/package/@thalesrc/ng-utils)
[![npm](https://img.shields.io/npm/l/@thalesrc/ng-utils.svg)](https://github.com/thalesrc/ng-utils/blob/master/LICENSE)

## Installation

| Angular Version | Command                           |
|-----------------|-----------------------------------|
| Version 8       | `npm i @thalesrc/ng-utils@v8-lts` |
| Version 9       | `npm i @thalesrc/ng-utils@v9-lts` |


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

### Form Array

Form Array directives for template driven forms

----------------------------------------------

#### ArrayDirective

* selector: `[thaArrayModel]`
* exportAs: `thaArrayModel`
* extends: `NgModel`

#### ArrayItemDirective

* selector: `[thaArrayItem]`
* exportAs: `thaArrayItem`
* extends: `NgModel`
* do not forget to use `formControl` for builtin form controls

#### ArrayGroupDirective

* selector: `[thaArrayGroup]`
* exportAs: `thaArrayGroup`
* extends: `NgModelGroup`

----------------------------------------------

Basic Usage:
```html
<!-- model: ['foo', 'bar']-->

<form #form="ngForm">
  <div thaArrayModel name="foo">
    <input formControl thaArrayItem *ngFor="let item of model">
  </div>
</form>

<pre>{{form.value | json}}</pre>
<!--{ foo: [
  'input 1 text',
  'input 2 text',
]} -->
```

Set values from `thaArrayModel`:
```html
<!-- model: ['foo', 'bar']-->

<form>
  <div [thaArrayModel]="model" name="list">
    <input formControl thaArrayItem *ngFor="let item of model">
  </div>
</form>
```

Set values from `thaArrayItem`:
```html
<!-- model: ['foo', 'bar']-->

<form>
  <div thaArrayModel name="list">
    <input formControl [thaArrayItem]="item" *ngFor="let item of model">
  </div>
</form>
```

Disable all items:
```html
<!-- model: ['foo', 'bar']-->

<form>
  <div thaArrayModel name="list" disabled>
    <input formControl [thaArrayItem]="item" *ngFor="let item of model">
  </div>
</form>
```

Use `formControl` to get form control classes from angular
```html
<!-- model: ['foo', 'bar']-->

<form>
  <div formControl thaArrayModel name="list"> <!-- class="ng-valid ng-pristine ng-untouched" -->
    <input formControl [thaArrayItem]="item" *ngFor="let item of model">
  </div>
</form>
```

Template variables can be used
```html
<!-- model: ['foo', 'bar']-->

<form>
  <div formControl thaArrayModel name="list" #list="thaArrayModel">
    <ng-template ngFor let-item [ngForOf]="model">
      <input formControl [thaArrayItem]="item" #itemModel="thaArrayItem" required>
      <pre>{{itemModel.valid}}</pre>
    </ng-template>
  </div>
  <pre>{{ list.errors | json }}</pre>
</form>
```

Create groups like `ngModelGroup` in an array section
```html
<form>
  <div thaArrayModel name="list">
    <div thaArrayGroup>
      <input name="firstname" ngModel required>
      <input name="lastname" ngModel required>
    </div>
    <div thaArrayGroup>
      <input name="firstname" ngModel required>
      <input name="lastname" ngModel required>
    </div>
  </div>
</form>
```

### Form Disabled

Shorthand to disable/enable all controls in a form.

Usage:
```html
<!-- basic usage -->
<form [disabled]="foo">
  <input ngModel name="username" />
  <input ngModel name="email" />
</form>

<!-- shorthand for disabled: true -->
<form disabled>
  <input ngModel name="username" />
  <input ngModel name="email" />
</form>

<!-- shorthand for disabled: false -->
<form disabled="false">
  <input ngModel name="username" />
  <input ngModel name="email" />
</form>

```

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
  <img thaImageInput [changeButton]="imgBtn" [src]="(user$ | async)?.avatar || 'assets/img/avatar.png'" ngModel name="avatar">
  <button type="button" #imgBtn>Change Image</button>
</form>
```

## Overlay

Create your own custom modals, dialogs etc.

_Dependencies:_
* `@angular/cdk`

_Required Root Module Imports:_
* `OverlayModule` from `@thalesrc/ng-utils`

### OverlayComponent

`tha-overlay` component comes with no styling except cdk prebuilt styles. It contains only the open/close functionality based on `CdkOverlay` so feel free to use it with your other `CdkOverlay` based components.

* `exportAs`: 'thaOverlay'
* `open()`: Open the modal
  *  _[Returns] A promise which emits the value set on close_
* `close(event: any)`: Closes the modal by emitting a value
  * [Arg] `event`: the value to emit (default false)
* `(opened)`: [EventEmitter] Emits when it is opened
* `(closed)`: [EventEmitter] Emits the values set when it is closed _(Emits `false` when no value is set or if it's closed by backdrop click)_

Usage:
```scss
// style.scss
@import '~@angular/cdk/overlay-prebuilt.css';
```

```typescript
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    OverlayModule
  ],
  providers: [],
})
export class FooModule { }
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

## Resize

Observe element's size changes, animate their size, etc..

_Dependencies:_
* `@angular/animations`
* `@angular/platform-browser`
* `@thalesrc/resize-manager`

_Required Root Module Imports:_
* `BrowserAnimationsModule` from `@angular/platform-browser/animations`

### ResizeService

Observe an element's size changes, listen window.resize

Usage:
```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit {
  constructor(
    private resizeService: ResizeService,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.resizeService.windowResize$.subscribe(({width, height}) => {
      console.log(width, height);
    });

    this.resizeService.observe(this.el.nativeElement).subscribe(({width, height}) => {
      console.log(width, height);
    });

    this.resizeService.observe(document.querySelector('bar')).subscribe(({width, height}) => {
      console.log(width, height);
    });
  }
}

```

### ResizeDirective

Emits size change events of an element

Usage:

```html
<!-- Listen both width and height change ($event: {width: number, height: number}) -->
<img [src]="src$ | async" thaResize (onResize)="postSizeChange($event)">

<!-- Listen only width change ($event: number) -->
<img [src]="src$ | async" thaResize="width" (onResize)="postWidthChange($event)">

<!-- Listen only height change ($event: number) -->
<img [src]="src$ | async" thaResize="height" (onResize)="postHeightChange($event)">
```

### AnimateResizeDirective

Animate resizing of an element

Usage:

```html
<!-- Animate both width and height change -->
<img [src]="src$ | async" thaAnimateResize>

<!-- Animate only width change -->
<img [src]="src$ | async" thaAnimateResize="width">

<!-- Animate only height change -->
<img [src]="src$ | async" thaAnimateResize="height">

<!-- Set animation duration  -->
<img [src]="src$ | async" thaAnimateResize duration="1000">

<!-- Do smth when animation completed  -->
<img [src]="src$ | async" thaAnimateResize (animationComplete)="doSomething()">
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
