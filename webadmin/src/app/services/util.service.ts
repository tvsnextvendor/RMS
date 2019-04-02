import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class UtilService {

  constructor() { }

  getRole(){
  let data =  atob(localStorage.getItem('userData'));
  let user = JSON.parse(data);
   return user.UserRole[0].roleId;
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  getUserData(){
    const userData = atob(localStorage.getItem('userData'));
    return JSON.parse(userData);
  }
  
}