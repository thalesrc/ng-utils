import { Component, OnInit, Input } from '@angular/core';
import { InputStream } from '@ng-utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  @Input()
  @InputStream(2)
  public a: Observable<any>;

  constructor() {
  }

  ngOnInit() {
  }

}
