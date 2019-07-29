import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class UtilService {

  constructor() { }

  getRole(){
  let data =  atob(localStorage.getItem('userData'));
  let user = JSON.parse(data);
  let roleId = user.UserRole && user.UserRole[0] && user.UserRole[0].roleId
   return roleId;
  }
  
  getToken(){
    return localStorage.getItem('token');
  }

  getUserData(){
    const userData = atob(localStorage.getItem('userData'));
    return JSON.parse(userData);
  }

  getRolePermissions(){
    let data = localStorage.getItem('RolePermissions');
    let result = data && JSON.parse(data).length ? JSON.parse(data)  : [];
    return result;
  }
  
}