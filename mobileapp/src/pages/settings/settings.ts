import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { ToastrService } from '../../service/toastrService';
import { AuthProvider } from '../../providers/auth/auth';
import { HttpProvider } from '../../providers/http/http';
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
  settingsForm: FormGroup;
  setting = {
    'oldpassword': '',
    'newpassword': '',
    'confirmpassword': '',
    'sms': false,
    'email': false
  }
  currentUser;
  showPasswordChange: boolean = true;
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
      email: new FormControl('')
    });
    this.getUser();
  }
  submit() {
    if (this.setting.newpassword !== this.setting.confirmpassword) {
      this.toastr.error("Password Mismatch"); return false;
    } else if (this.currentUser.password !== this.setting.oldpassword) {
      this.toastr.error("Old password is wrong"); return false;
    } else {
      this.toastr.success('Password changed successfully');
      this.navCtrl.setRoot('home-page');
    }
  }
  goToPrevious() {
    this.navCtrl.setRoot('home-page');
  }
  toggleSection() {
    this.showPasswordChange = !this.showPasswordChange;
  }
  notificationAPI() {
    let sms = this.setting.sms;
    let email = this.setting.email;

    let json_notify = {
      "Notification_SettingDetails":
      {
        "sms": sms,
        "email": email
      }
    };
    this.toastr.success('Notification setting updated');
    this.http.post('postNotification', json_notify).subscribe((data) => {
      this.toastr.success('Notification setting updated');
    });
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
