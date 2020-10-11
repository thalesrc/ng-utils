import { Injectable } from '@angular/core';
import { ResizeManager, ResizeEvent } from '@thalesrc/resize-manager';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private static manager = new ResizeManager(0);

  public windowResize$: Observable<ResizeEvent> = ResizeService.manager.root.resize;

  public observe(target: HTMLElement, throttleBy = 90): Observable<ResizeEvent> {
    return ResizeService.manager.observe(target).throttleBy(throttleBy);
  }
}
