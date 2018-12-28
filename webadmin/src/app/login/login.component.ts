import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {loginVar} from '../Constants/login.var';
import {HttpService} from '../services/http.service'
import { API_URL } from '../Constants/api_url';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

    forgetPasswordStatus = false;
    userArray = [];
    rememberMe = false;
    rememberMeCheck =[];
    labels;
    btns;
    constructor(private route: Router, public loginvar: loginVar, private toastr: ToastrService,
            private http: HttpService,private API_URL:API_URL) { }

    ngOnInit() {
      // get user details '5c0fbeda3100003b1324ee75'
      this.http.get(API_URL.URLS.getUsers).subscribe((resp) => {
        this.userArray = resp.UserList;
      });
      
      //labels
      this.labels = this.loginvar.labels;
      this.btns = this.loginvar.btns;

      //remember check
      let localData = (localStorage.getItem("rememberMe"));
      if(localData){
        this.rememberMeCheck = JSON.parse(atob(localData));
        this.rememberCheck(this.loginvar.email);
      }
    }
// Password remember check
    rememberCheck(data){
      let user = this.rememberMeCheck.find(x => x.email === data);
      if(user && user.remember){
        this.loginvar.password = user.password;
        this.rememberMe = user.remember;
      }
      else if(user && !user.remember){
        this.loginvar.password = '';
        this.rememberMe = user.remember;
      }
    }

    forgetPasswordUpdate(){
      this.forgetPasswordStatus = !this.forgetPasswordStatus;
      this.loginvar.email = '';
      this.loginvar.password = '';
      this.rememberMe = false;
    }

    // Common function for login and forget password
    submitLogin(data, forgetStatus) {
      if(forgetStatus){
        // forgetpassword
        if(data.email){
          let user = {};
          let userIndex;
          this.userArray.map((item,index)=>{
            if (item.emailAddress === data.email){
              user =  item;
              userIndex = index;
            }
          })
            if(Object.keys(user).length){
              this.forgetPasswordStatus = false;
              this.toastr.success("Password update link sent to your mail id");
              let encIndex = btoa(userIndex)
              if(encIndex){
                this.route.navigateByUrl('/resetpassword/'+encIndex)
              }
            }
            else{
              this.toastr.error("Please enter registered email id")
            }
        }
        else{
          this.toastr.error("Please enter the registered email id")
        }

      }
      // login
      else if (data.email && data.password && !forgetStatus) {
            let user;
            this.userArray.map(item=>{
              if (item.emailAddress === data.email && item.password === data.password){
                user =  item;

                localStorage.setItem('user',btoa(JSON.stringify(user)));
              }
            })
            let userData = atob(localStorage.getItem('user'));
            //  if(Object.keys(user).length){
              if(userData !== 'null'){
                //let userData = JSON.stringify(user);
                //let encUserData = btoa(userData);
                localStorage.setItem('userData',userData);
                this.toastr.success("Login successfully");
                this.route.navigateByUrl('/');
                let localObject = [];
                // remember password settings
                if(this.rememberMeCheck.length){
                  localObject =  this.rememberMeCheck;
                  let user = localObject.find(x => x.email === data.email);
                  if(user){
                    let filterObject = localObject.filter(x => x.email !== data.email);
                    user.remember = this.rememberMe;
                    filterObject.push(user)
                    localStorage.setItem('rememberMe',btoa(JSON.stringify(filterObject)))
                  }
                  else{
                      this.setATLocal(data,localObject);
                  }
                }
                else{
                  this.setATLocal(data,localObject);
                }
              }
              else{
                this.toastr.error("Invalid login")
              }         
        } else {
            this.toastr.error("Please enter login details")
            localStorage.setItem('userData', '');
        }
    }

    setATLocal(data,localObject){
      let localRememberData={
        email : data.email,
        password : data.password,
        remember : this.rememberMe
      }
      localObject.push(localRememberData)
      localStorage.setItem('rememberMe',btoa(JSON.stringify(localObject)))
    }
}
