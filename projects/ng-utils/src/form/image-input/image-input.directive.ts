import { Directive, forwardRef, Input, OnInit, ElementRef, HostListener, HostBinding } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator } from '@angular/forms';
import { noop } from '@thalesrc/js-utils/function/noop';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable } from 'rxjs';
import { map, distinctUntilChanged, first, pluck, switchMap, filter } from 'rxjs/operators';
import { Unsubscriber } from '../../utils/unsubscriber';
import { shareLast } from '../../utils/share-last';
import { InputStream } from '../../utils/input-stream';
import { ListenerStream } from '../../utils/listener-stream';

interface ImageInputConfig {
  button?: HTMLElement;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'img[thaImageInput]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ImageInputDirective, multi: true },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageInputDirective), multi: true}
  ],
  exportAs: 'thaImageInput'
})
export class ImageInputDirective extends Unsubscriber implements ControlValueAccessor, Validator, OnInit {
  // tslint:disable-next-line:max-line-length
  private static TRANSPARENT_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Wg8AAm8BdpLdi+IAAAAASUVORK5CYII=';

  private onChange: (value: File) => void = noop;
  private onTouched: () => void = noop;
  private onValidatorChange: () => void = noop;

  private input = ImageInputDirective.createInput();

  @Input()
  @InputStream(ImageInputDirective.TRANSPARENT_URL)
  public src: Observable<string>;

  @Input('thaImageInput')
  @InputStream()
  public config: Observable<ImageInputConfig>;

  private modelFile$ = new BehaviorSubject<File>(null);

  private emptySource$ = this.src.pipe(
    distinctUntilChanged()
  );

  private inputChange$ = fromEvent(this.input, 'change').pipe(
    map(event => {
      let file = this.input.files[0] || null;

      if (file && !['image/jpeg', 'image/png', 'image/gif'].some(type => type === file.type)) {
        this.input.value = '';
        file = null;
      }

      return file;
    })
  );

  public file$ = merge(this.modelFile$, this.inputChange$).pipe(shareLast());

  @HostListener('click', ['$event'])
  @ListenerStream()
  private hostClick: Observable<void>;

  @Input()
  private disabled = false;

  @HostBinding('style.cursor')
  public cursor: null | 'pointer' = null;

  private static createInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.gif';

    return input;
  }

  constructor(
    private el: ElementRef<HTMLImageElement>
  ) {
    super();
  }

  public ngOnInit() {
    // Emit Change
    this.subs = this.inputChange$.subscribe(value => {
      this.onChange(value);
    });

    // Change image src url
    this.subs = combineLatest(this.file$, this.emptySource$).subscribe(([file, src]) => {
      if (!file) {
        this.el.nativeElement.src = src;

        return;
      }

      this.el.nativeElement.src = URL.createObjectURL(file);
    });

    // Open selector
    this.subs = this.config.pipe(
      map(config => config || {}),
      pluck('button'),
      switchMap(button => button ? fromEvent(button, 'click') : this.hostClick),
      filter(() => !this.disabled)
    ).subscribe(() => {
      this.onTouched();
      this.input.click();
    });

    // Set Cursor
    this.subs = this.config.pipe(
      map(config => config || {}),
      pluck('button'),
    ).subscribe(button => {
      this.cursor = (button || this.disabled) ? null : 'pointer';
    });
  }

  public registerOnChange(fn: (value: File) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public async writeValue(value: File) {
    if (!value) {
      value = null;
    }

    const current = await this.file$.pipe(first()).toPromise();

    if (value === current) {
      return;
    }

    this.modelFile$.next(value);
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public validate() {
    return null;
  }
}
