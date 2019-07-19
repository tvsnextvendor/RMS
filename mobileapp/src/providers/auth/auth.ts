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
           let loginData = res['data'];
          if (loginData.rolePermissions) {
              const rolePermissions = loginData.rolePermissions;
              const resultRolePermissions = this.getObject(rolePermissions, []);
              let permissions = [];
              for (let i in resultRolePermissions) {
                  if (i != 'undefined') {
                      permissions.push(resultRolePermissions[i]);
                  }
              }
              this.storage.set('RolePermissions', JSON.stringify(permissions)).then(() => {
              });
          }

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
    this.storage.remove('RolePermissions').then(() => {console.log("roles removed")})
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


   getObject(theObject, userpermissions) {
    var result = null;
    var key = 'moduleName';
    if (theObject instanceof Array) {
      for (var i = 0; i < theObject.length; i++) {
        if (userpermissions[theObject[i].moduleName] == undefined) {
          userpermissions[theObject[i].moduleName] = [];
          userpermissions[theObject[i].moduleName] = theObject[i];
        }
        result = this.getObject(theObject[i], userpermissions);
      }
    }
    else {
      let moduleName = theObject.moduleName;
      for (var prop in theObject) {
        const data = ["moduleName", "view", "upload", "edit", "delete"];
        let found = data.includes(prop);
        if (found) {
          if (theObject[prop] == true || theObject[prop] == false) {
            userpermissions[moduleName][prop] = (userpermissions[moduleName][prop] == true) ? true : theObject[prop];
          }
        }
        if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = this.getObject(theObject[prop], userpermissions);
        }
      }
    }
    return userpermissions;
  }
}