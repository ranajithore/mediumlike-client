import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  public shouldShowLoadingBar = new BehaviorSubject(false);

  constructor() {}

  public showLoadingBar() {
    this.shouldShowLoadingBar.next(true);
  }

  public hideLoadingBar() {
    this.shouldShowLoadingBar.next(false);
  }
}
