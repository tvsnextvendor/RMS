import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class UtilService {

  constructor() { }

  getRole(){
  let data =  atob(localStorage.getItem('user'));
  let user = JSON.parse(data);
   return user.roleId;
  }

}