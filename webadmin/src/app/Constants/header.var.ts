import {Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class HeaderVar {

 url;
 notificationList;
 title:string = '';
 moduleType: null;
 moduleList;
 hideModule = false;
 splitUrl;
 logout = "Logout";
 profile = "Profile";
  
}