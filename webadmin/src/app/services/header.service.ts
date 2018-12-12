import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
    providedIn: 'root'
  })
export class HeaderService {
  public title = new BehaviorSubject({title:'',hidemodule:0});
  public moduleSelection = new BehaviorSubject('Module');

  constructor() { }

  setTitle(title) {
    this.title.next(title);
  }
  
  selectModule(module) {
    this.moduleSelection.next(module);
  }

}