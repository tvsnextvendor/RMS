import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../http/http';
import { API_URL } from '../../constants/API_URLS.var';
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
  
  constructor(public http: HttpProvider, public toastr: ToastrService, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }
  login(name: string, pw: string, keepmelogin: boolean): Promise<boolean> {
   // var self = this;
    return new Promise((resolve, reject) => {
      let postData = {'emailAddress':name,'password':pw,'keepmelogin':keepmelogin};

      console.log(API_URL.URLS.loginAPI);
      this.http.post(false,API_URL.URLS.loginAPI,postData).subscribe((res) => {


        console.log(res);
        if (res['isSuccess'])
        {
          this.storage.set('currentUser', res['data']).then(() => {
            console.log('currentUser has been set');

            this.currentUserSet = {
              token :res['data']['token'],
              name: res['data']['userName'],
              role: res['data']['UserRole'][0]['roleId']
            } 
            
          });
          resolve(true);


        
        }else{

          console.log(res);
          console.log(res['error']);
         // self.loginEmailError = res['error'];
           reject(false);
        }


      },(err)=>{
        console.log(err);
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
