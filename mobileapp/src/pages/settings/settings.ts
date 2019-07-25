import { Component, OnInit,ViewChild } from '@angular/core';
import {Nav, IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { ToastrService } from '../../service/toastrService';
import { AuthProvider } from '../../providers/auth/auth';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'settings-page'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [Constant]
})
export class SettingsPage implements OnInit {
  @ViewChild(Nav) nav; Nav;
  
  settingsForm: FormGroup;
  setting = {
    'oldpassword': '',
    'newpassword': '',
    'confirmpassword': '',
    'sms': false,
    'email': false,
    'whatsapp':false
  }
  currentUser;
  showPasswordChange: boolean = true;
  errorMessage = '';
  @ViewChild(Content) content: Content;
  showToastr: boolean = false;
  className;
  msgTitle;
  msgDes;

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public toastr: ToastrService, public auth: AuthProvider, private http: HttpProvider, private storage: Storage) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ngOnInit() {
    this.settingsForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      newpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      sms: new FormControl(''),
      email: new FormControl(''),
      whatsapp:new FormControl('')
    });
    this.getUser();
  }
  successMessage(msg){
    this.content.scrollToTop();
    this.showToastr = true;
    this.className = "notify-box alert alert-success";
    this.msgTitle = "Success";
    this.msgDes = msg ;
    let self = this;
    setTimeout(function(){ 
      self.showToastr = false;
      self.navCtrl.push('home-page');
      }, 3000); 
  }
  submit() {
    this.errorMessage = '';
    if (this.setting.newpassword !== this.setting.confirmpassword) {
      this.errorMessage = "Password Mismatch";
    }else {
      let postData={
        "userId": this.currentUser.userId,
        "oldPassword":this.setting.oldpassword,
        "newPassword": this.setting.newpassword,
        "sms":this.setting.sms,
        "email":this.setting.email,
        "whatsapp":this.setting.whatsapp
      }
      this.http.put(false, API_URL.URLS.updateSettings, postData).subscribe(res=>{
        if(res['isSuccess']){
          this.successMessage(res['message']);
        //  this.toastr.success(res['message']);
           
        }
      },(err)=>{
        this.toastr.error(err.error.error);
      }) 
    }
  }
  goToPrevious() {
    this.navCtrl.push('home-page');
  }
  toggleSection() {
    this.showPasswordChange = !this.showPasswordChange;
  }
  

   logOut() {
    this.auth.logout();
    this.navCtrl.push('login-page');
  }

  getUser() {
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          this.currentUser = val;
        }
      }, (err) => {
        console.log('currentUser not received in app.component.ts', err);
      });
  }
}
