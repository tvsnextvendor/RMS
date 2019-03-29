import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Header } from '../Constants/header';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class HeaderService {
  public title = new BehaviorSubject<Header>({} as Header);
  public moduleSelection = new BehaviorSubject('Module');

  public TitleDetail = this.title.asObservable().pipe(distinctUntilChanged());

  constructor() { }

  setTitle(head: Header) {
    this.title.next(head);
  }

  getTitleDetail(){
    return this.title.value;
  }
  
  selectModule(module) {
    this.moduleSelection.next(module);
  }

}