import { Component, ViewChild, HostListener } from '@angular/core';
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

  public arrayInputs = ['test'];

  constructor() {
    // setInterval(this.changeImage.bind(this), 1000);
  }

  @ViewChild(OverlayComponent, {static: true})
  private overlay: OverlayComponent;

  private count = 0;
  public changeImage() {
    this.image.next(`https://picsum.photos/id/${this.count++}/${Math.floor(Math.random() * 500)}/${Math.floor(Math.random() * 500)}`);
  }

  @HostListener('window:keyup.r')
  public rrr() {
    this.changeImage();
  }

  public modelChange(event: any) {
    // console.log(event);
  }

  public openOverlay() {
    this.overlay.open().then(console.log);
  }

  public onResize(event) {
    console.log(event);
  }
}
