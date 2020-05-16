import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { take, mapTo, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // tslint:disable-next-line:max-line-length
  public image = interval(3000).pipe(take(1), mapTo('assets/angular.svg'), startWith(''));
}
