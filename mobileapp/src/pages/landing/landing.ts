import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var'
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';

@IonicPage({ name: 'landing-page' })
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
  providers: [Constant]
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }
  doSignIn() {
    this.navCtrl.push(LoginPage);
  }
  doSignUp() {
    this.navCtrl.push(SignupPage);
  }

}
