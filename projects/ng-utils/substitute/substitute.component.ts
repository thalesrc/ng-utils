import { Component, Input } from '@angular/core';
import { InputStream, shareLast } from '../utils';
import { Observable } from 'rxjs';
import { SubstituteService } from './substitute.service';
import { combineLatest, filter, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'tha-substitute',
  templateUrl: './substitute.component.html',
  styleUrls: ['./substitute.component.scss']
})
export class SubstituteComponent {
  @Input('thaSubstituteScope')
  @InputStream()
  public scope: Observable<any> = null;

  public template$ = this.service.templates$.pipe(
    debounceTime(50),
    combineLatest(this.scope.pipe(filter(scope => scope !== null))),
    map(([templates, scope]) => templates.get(scope)),
    shareLast()
  );

  constructor(
    private service: SubstituteService
  ) {
  }
}
