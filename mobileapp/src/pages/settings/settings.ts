import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import {ToastrService} from '../../service/toastrService';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public toastr: ToastrService) {
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
  }
  submit() {
    this.toastr.success('Password changed successfully');
    this.navCtrl.setRoot('home-page');
  }
  goToPrevious(){
    this.navCtrl.setRoot('home-page');
  }
}
