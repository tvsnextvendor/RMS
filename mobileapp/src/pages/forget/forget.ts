import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
  name: 'forget-page'
})
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
  providers: [Constant]
})
export class ForgetPage implements OnInit {
  forgetform: FormGroup;
  forget = {
    "emailAddress": "",
    "phoneNumber": ""
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, private toastrCtrl: ToastController) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.forgetform = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }
  forgetfn() {
   // console.log(this.forget);
    let toast = this.toastrCtrl.create({
      message: 'Forget Password Successfully',
      duration: 2000,
      position: 'top',
      cssClass: 'error'
    });
    toast.present();
    this.navCtrl.setRoot('login-page');
    //API_URL.URLS.doSignup
    // this.http.post('/signup', this.signup).subscribe((data) => {
    //   console.log(data);
    // });
  }

}
