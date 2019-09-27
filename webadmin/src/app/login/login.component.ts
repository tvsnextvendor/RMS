import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loginVar } from '../Constants/login.var';
import { HttpService, CommonService, BreadCrumbService } from '../services';
import { API_URL } from '../Constants/api_url';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';
import { Permissions } from '../Constants/role_permission';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  forgetPasswordStatus = false;
  userArray = [];
  rememberMe = false;
  rememberMeCheck = [];
  labels;
  passwordError = false;
  emailError = false;
  btns;
  urlData;
  agreeTerms = false;

  constructor(private route: Router,
    public loginvar: loginVar,
    private toastr: ToastrService,
    private http: HttpService,
    private authService: AuthService,
    private API_URL: API_URL,
    private alertService: AlertService,
    public commonLabels: CommonLabels,
    private commonService: CommonService,
    private breadCrumbService: BreadCrumbService) { }

  ngOnInit() {
    // get user details '5c0fbeda3100003b1324ee75'
    // this.http.get(API_URL.URLS.getUsers).subscribe((resp) => {
    //   this.userArray = resp.UserList;
    // });
    this.breadCrumbService.setTitle([])
    //labels
    this.labels = this.loginvar.labels;
    this.btns = this.loginvar.btns;
    this.passwordError = false;
    //remember check
    let localData = (localStorage.getItem("rememberMe"));
    if (localData) {
      this.rememberMeCheck = JSON.parse(atob(localData));
      this.rememberCheck(this.loginvar.email);
    }
  }
  // Password remember check
  rememberCheck(data) {
    let user = this.rememberMeCheck.find(x => x.email === data);
    if (user && user.remember) {
      this.loginvar.password = user.password;
      this.rememberMe = user.remember;
    }
    else if (user && !user.remember) {
      this.loginvar.password = '';
      this.rememberMe = user.remember;
    }
  }
  forgetPasswordUpdate() {
    this.forgetPasswordStatus = !this.forgetPasswordStatus;
    this.loginvar.email = '';
    this.loginvar.password = '';
    this.rememberMe = false;
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
  // Common function for login and forget password
  submitLogin(data, forgetStatus) {
    if (forgetStatus) {
      // forgetpassword
      if (data.email) {
        let params = {
          "emailAddress": data.email
        }
        this.commonService.forgetPassword(params).subscribe(resp => {
          if (resp && resp.isSuccess) {
            this.forgetPasswordStatus = false;
            this.alertService.success(resp.message);
          }
        }, err => {
          this.alertService.error(err.error.error)
        })
      }
      else {
        this.alertService.error(this.commonLabels.msgs.regisEmail)
      }

    }
    // login
    else if (data.email && data.password && !forgetStatus) {
      let user = {};
      this.passwordError = false;
      this.emailError = false;
      let loginCredential = {
        userName: data.email,
        // emailAddress: data.email,
        password: data.password,
        type: 'web',
        agreeTerms : this.agreeTerms
      }
      this.authService.login(loginCredential).subscribe(result => {
        if (result.isSuccess) {
          const loginData = result.data;

         
          const role = loginData.UserRole[0].roleId;

          if(loginData.ResortUserMappings){
            let divisions = [];
            const resortMaps = loginData.ResortUserMappings;
            resortMaps.forEach(function(val,key){
              if(val.divisionId != 'undefined' && val.divisionId != null){
                divisions.push(val.divisionId);
                }
            });
            localStorage.setItem('divisions',JSON.stringify(divisions));
          }

         

          if(loginData.rolePermissions){
            const rolePermissions = loginData.rolePermissions;
            const resultRolePermissions = this.getObject(rolePermissions, []);
            let permissions = [];
            for(let i in resultRolePermissions){
                 if(i != 'undefined'){
                  permissions.push(resultRolePermissions[i]);
                 }
            }
            localStorage.setItem('RolePermissions',JSON.stringify(permissions));
          }
          if (role === 4) {
            console.log(loginData, "RolePermissisons")
            if(loginData.rolePermissions){
              let permissionData = loginData.rolePermissions && loginData.rolePermissions.length ?  loginData.rolePermissions[0].userPermission : Permissions.user.menu;
              console.log(permissionData,"PERMISSION DATA");
              permissionData.forEach(item => {
                  if (item.moduleName == 'Course / Training Class / Quiz' || item.moduleName == 'Notification') {
                     if(item.edit == true){
                        this.urlData = '/cmspage?type=create';
                        this.route.navigateByUrl(this.urlData);
                        return false;
                      }else if (item.view == true) {
                           this.urlData = '/cmspage?type=edit';
                           this.route.navigateByUrl(this.urlData);
                           return false;
                       }
                  }else{
                    let menuArray = [{key: 'Dashboard', value: '/dashboard'}, {key:'Schedule', value:'/calendar'}, {key: 'Resource Library', value: '/resource/library'}, {key:'User Management', value:'/users'}, {key:'Site Management', value : '/resortslist'},{ key: 'Approval Request', value : '/approvalrequests'},{ key: 'Certificates', value:'/certificates'}, {key:'Subscription Model', value : '/subscriptionlist'}, {key: 'Feedback', value : '/feedback'}]
                      menuArray.forEach(element => {
                         if(element.key == item.moduleName){
                           if(item.view == true || item.edit == true){
                             this.urlData = element.value;
                             this.route.navigateByUrl(this.urlData);
                             return false;
                           }
                         }
                      });
                  }
              })
              console.log(this.urlData,"URLDATA");
            }
          } else {
            this.route.navigateByUrl('/dashboard');
          }
          this.alertService.success(this.commonLabels.msgs.loginSuccess);
          let resortName = result.data.ResortUserMappings.length && result.data.ResortUserMappings[0].Resort.resortName;
          localStorage.setItem("resortName", resortName);
        }
      }, error => {
        error.error == "Invalid Password" ? this.passwordError = true : (error.error == "Invalid Email Address" ? this.emailError = true : 'Network connection failed');
        this.alertService.error(error.error)
      })
      let localObject = [];
      // remember password settings
      if (this.rememberMeCheck.length) {
        localObject = this.rememberMeCheck;
        let user = localObject.find(x => x.email === data.email);
        if (user) {
          let filterObject = localObject.filter(x => x.email !== data.email);
          user.remember = this.rememberMe;
          filterObject.push(user)
          localStorage.setItem('rememberMe', btoa(JSON.stringify(filterObject)))
        }
        else {
          this.setATLocal(data, localObject);
        }
      }
      else {
        this.setATLocal(data, localObject);
      }
    }

    else {
      // this.toastr.error("Please enter login details");
      localStorage.setItem('userData', '');
    }
  }

  setATLocal(data, localObject) {
    let localRememberData = {
      email: data.email,
      password: data.password,
      remember: this.rememberMe
    }
    localObject.push(localRememberData)
    localStorage.setItem('rememberMe', btoa(JSON.stringify(localObject)))
  }
}
