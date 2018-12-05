import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
    providedIn: 'root'
  })
export class HeaderService {
  public title = new BehaviorSubject('Title');
  
  constructor() { }

  setTitle(title) {
    this.title.next(title);
  }
}