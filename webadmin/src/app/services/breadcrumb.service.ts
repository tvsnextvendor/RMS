import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Header } from '../Constants/breadcrumb';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })

export class BreadCrumbService {
//   public title = new BehaviorSubject<Header>({} as Header);
//   public moduleSelection = new BehaviorSubject('Module');
//   public TitleDetail = this.title.asObservable().pipe(distinctUntilChanged());
title = [];
  constructor() {}

  setTitle(head) {
    this.title = head;
  }
}