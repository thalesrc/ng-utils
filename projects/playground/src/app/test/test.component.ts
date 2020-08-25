import { Component, OnInit, Input } from '@angular/core';
import { InputStream } from 'projects/ng-utils/src/utils/input-stream';
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
