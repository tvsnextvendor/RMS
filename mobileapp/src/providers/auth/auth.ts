import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }
  login(name: string, pw: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (name === 'admin' && pw === 'admin') {
        this.currentUserSet = {
          name: name,
          role: 0
        }
        resolve(true);
      } else {
        reject(false);
      }
    });
  }

  isLoggedIn() {
    return this.currentUserSet !== null;
  }
  logout() {
    this.currentUserSet = null;
  }

}
