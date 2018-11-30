//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';
import { ToastController } from 'ionic-angular';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
export interface User {
  name: string;
  role: number;
}
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  currentUserSet: User;
  users: any = [];
  constructor(public http: HttpProvider, public toastCtrl: ToastController,public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }
  login(name: string, pw: string): Promise<boolean> {
    var self = this;
    return new Promise((resolve, reject) => {

      this.http.getData(API_URL.URLS.getUsers).subscribe((data) => {
        if (data) {
          this.users = data;
          let usernameCorrect = this.users.find(x => x.username === name);
          let passwordCorrect = this.users.find(x => x.password === pw);

          if (!usernameCorrect) {
            let toast = self.toastCtrl.create({
              message: 'Username is invalid',
              duration: 2000,
              position: 'top',
              cssClass: 'error'
            });
            toast.present();
            reject(false);
          } else if (!passwordCorrect) {
            let toast = self.toastCtrl.create({
              message: 'Password is invalid',
              duration: 2000,
              position: 'top',
              cssClass: 'error'
            });
            toast.present();
            reject(false);
          } else {
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
    this.storage.remove('userDashboardInfo');
  }

}
