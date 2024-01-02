import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventsService {
  public userLoaded = new BehaviorSubject(false);
  constructor() {}
}
