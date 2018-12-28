import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { ToastrService } from '../../service/toastrService';
import { AuthProvider } from '../../providers/auth/auth';

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
    'confirmpassword': ''
  }
  currentUser;
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public toastr: ToastrService, public auth: AuthProvider) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  ngOnInit() {
    this.settingsForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      newpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
    });
    this.currentUser = this.auth.getCurrentUserDetails();
    console.log(this.currentUser);
    console.log(this.currentUser.password);
  }
  submit() {
   // console.log(this.currentUser);
   // debugger;
    if (this.setting.newpassword !== this.setting.confirmpassword) {
      this.toastr.error("Password Mismatch"); return false;
    }
    this.toastr.success('Password changed successfully');
    this.navCtrl.setRoot('home-page');
  }
  goToPrevious() {
    this.navCtrl.setRoot('home-page');
  }
}
