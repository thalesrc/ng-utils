import { Component, ViewChild } from '@angular/core';
import { interval, BehaviorSubject } from 'rxjs';
import { take, mapTo, startWith, map } from 'rxjs/operators';
import { OverlayComponent } from '@ng-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // tslint:disable-next-line:max-line-length
  public image = new BehaviorSubject('');

  @ViewChild(OverlayComponent, {static: true})
  private overlay: OverlayComponent;

  private count = 0;
  public changeImage() {
    this.image.next(`https://picsum.photos/id/${this.count++ * 100}/200/300`);
  }

  public modelChange(event: any) {
    console.log(event);
  }

  public openOverlay() {
    this.overlay.open().then(console.log);
  }
}
