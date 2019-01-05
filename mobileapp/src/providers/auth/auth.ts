import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../http/http';
import { API_URL } from '../../constants/API_URLS.var';
import {ToastrService} from '../../service/toastrService';

export interface User {
  name: string;
  role: number;
}
@Injectable()
export class AuthProvider {
  currentUserSet: User;
  users: any = [];
  
  constructor(public http: HttpProvider, public toastr: ToastrService, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }
  login(name: string, pw: string, keepmelogin: boolean): Promise<boolean> {
    var self = this;
    return new Promise((resolve, reject) => {
      this.http.getData(API_URL.URLS.getUsers).subscribe((data) => {
        if (data['isSuccess']) {
          this.users = data['UserList'];
          let usernameCorrect = this.users.find(x => x.emailAddress === name);
          let passwordCorrect = this.users.find(x => x.password === pw);
          if (!usernameCorrect) {
            self.toastr.error('Email ID is invalid');
            reject(false);
          } else if (!passwordCorrect) {
            self.toastr.error('Password is invalid');
            reject(false);
          } else {
            this.storage.set('currentUser', usernameCorrect).then(() => {
              console.log('currentUser has been set');
            });
            this.currentUserSet = {
              name: name,
              role: 0
            }
            resolve(true);
          }
        }
      });
    });
  }
  isLoggedIn() {
    return this.currentUserSet !== null;
  }
  logout() {
    this.currentUserSet = null;
    this.storage.remove('userDashboardInfo').then(() => { console.log("removed userDashboardInfo") });
    this.storage.remove('currentUser').then(() => { console.log("removed currentUser") });
  }
  getCurrentUserDetails(){
     let self = this;
      return new Promise((resolve, reject) => {
        self.storage.get('currentUser').then(
        (val) => {
          if (val) {
            self.currentUserSet = val
            resolve(self.currentUserSet);
          }
        }, (err) => {
          reject(err);
          console.log('currentUser not received in app.component.ts', err);
        });
      });
  }
}
