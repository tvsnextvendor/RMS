import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Content } from 'ionic-angular';
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
    let self=this;
    this.errorMessage = '';
    if (this.setting.newpassword !== this.setting.confirmpassword) {
     // this.toastr.error("Password Mismatch"); return false;
      this.errorMessage = "Password Mismatch";
    } else if (this.currentUser.password !== this.setting.oldpassword) {
     // this.toastr.error("Old password is wrong"); return false;
      this.errorMessage = "Old password is wrong";

    } else {
      this.errorMessage = '';

      const alert = this.alertCtrl.create({
        title: 'Password changed successfully.',
        buttons: [
        //   {
        //     text: 'No',
        //     role: 'no',
        //     handler: () => {
        //         // console.log('Later clicked');
        //     }
        // },
        {
            text: 'Ok',
            handler: () => {
                self.navCtrl.setRoot('home-page');
            }
        }]
    });
    alert.present();




      //this.toastr.success('Password changed successfully');
     // this.navCtrl.setRoot('home-page');
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
   // this.toastr.success('Notification setting updated');
    this.http.post(true,'postNotification', json_notify).subscribe((data) => {
     // this.toastr.success('Notification setting updated');
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
