import { Directive, forwardRef, Input, OnInit, ElementRef, HostListener, HostBinding } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator } from '@angular/forms';
import { noop } from '@thalesrc/js-utils/function/noop';
import { BehaviorSubject, combineLatest, fromEvent, merge } from 'rxjs';
import { map, distinctUntilChanged, first } from 'rxjs/operators';
import { Unsubscriber } from '../../utils/unsubscriber';
import { shareLast } from '../../utils/share-last';

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

  private src$ = new BehaviorSubject<string>(ImageInputDirective.TRANSPARENT_URL);
  private modelFile$ = new BehaviorSubject<File>(null);

  private emptySource$ = this.src$.pipe(
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

  @Input()
  private disabled = false;

  @Input('src')
  private set _src(src: string) {
    this.src$.next(src);
  }

  @HostBinding('style.cursor')
  public get _cursor(): string {
    return this.disabled ? null : 'pointer';
  }

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

  @HostListener('click')
  public onHostClick() {
    if (this.disabled) {
      return;
    }

    this.onTouched();
    this.input.click();
  }

  public ngOnInit() {
    this.subs = this.inputChange$.subscribe(value => {
      this.onChange(value);
    });

    this.subs = combineLatest(this.file$, this.emptySource$).subscribe(([file, src]) => {
      if (!file) {
        this.el.nativeElement.src = src;

        return;
      }

      this.el.nativeElement.src = URL.createObjectURL(file);
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
