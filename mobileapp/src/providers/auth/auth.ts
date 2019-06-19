import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants/API_URLS.var';
import { API } from '../../constants/API.var';
import {ToastrService} from '../../service/toastrService';
import 'rxjs/add/operator/catch';

export interface User {
  name: string;
  role: number;
  token:string;
}
@Injectable()
export class AuthProvider {
  currentUserSet: User;
  users: any = [];
  loginEmailError;
  loginPassErr;
  
  constructor(public http: HttpClient, public toastr: ToastrService, public storage: Storage) {
  }
  
  
  login(name: string, pw: string, keepmelogin: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let postData = {'emailAddress':name,'password':pw,'keepmelogin':keepmelogin,'type':'mobile'};
      this.http.post(API['API_LINK']+API_URL.URLS.loginAPI,postData).subscribe((res) => {
        if (res['isSuccess'])
        {
          this.storage.set('currentUser', res['data']).then(() => {
            this.currentUserSet = {
              token :res['data']['token'],
              name: res['data']['userName'],
              role: res['data']['UserRole'][0]['roleId']
            } 
            
          });
          resolve(true);      
        }else{
         reject(false);
        }
      },(err)=>{
        reject(false);
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