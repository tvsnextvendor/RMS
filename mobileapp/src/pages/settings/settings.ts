import { Component, OnInit,ViewChild } from '@angular/core';
import {Nav, IonicPage, NavController, NavParams, AlertController,Content } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public toastr: ToastrService, public auth: AuthProvider, private http: HttpProvider, private storage: Storage,private alertCtrl:AlertController) {
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
  submit() {
    this.errorMessage = '';
    if (this.setting.newpassword !== this.setting.confirmpassword) {
     // this.toastr.error("Password Mismatch"); return false;
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
          this.toastr.success(res['message']);
           this.navCtrl.setRoot('home-page');
        }
      },(err)=>{
        this.toastr.error(err.error.error);
      }) 
    }
  }
  goToPrevious() {
    this.navCtrl.setRoot('home-page');
  }
  toggleSection() {
    this.showPasswordChange = !this.showPasswordChange;
  }
  

   logOut() {
    this.auth.logout();
    this.navCtrl.setRoot('login-page');
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
