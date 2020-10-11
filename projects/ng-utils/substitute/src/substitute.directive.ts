import { Directive, TemplateRef, OnDestroy, Input } from '@angular/core';
import { SubstituteService } from './substitute.service';
import { InputStream, Unsubscriber } from '../../utils.entry';
import { Observable } from 'rxjs';
import { pairwise, takeUntil, first } from 'rxjs/operators';

@Directive({
  selector: '[thaSubstitute]'
})
export class SubstituteDirective extends Unsubscriber implements OnDestroy {
  @Input('thaSubstitute')
  @InputStream()
  private scope: Observable<any>;

  constructor(
    private service: SubstituteService,
    template: TemplateRef<unknown>
  ) {
    super();

    this.scope.pipe(pairwise(), takeUntil(this.onDestroy$)).subscribe(([prev, next]) => {
      this.service.detach(prev);
      this.service.attach(next, template);
    });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();

    this.scope.pipe(first()).toPromise().then(scope => {
      this.service.detach(scope);
    });
  }

}
