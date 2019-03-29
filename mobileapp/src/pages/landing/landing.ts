import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var'
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Storage } from '@ionic/storage';

@IonicPage({ name: 'landing-page' })
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
  providers: [Constant]
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant,public storage:Storage) {
  }
  ionViewDidLoad() {
    this.storage.get('currentUser').then((resp) => {
      //console.log("currentUser",resp);
      if(resp){
        this.navCtrl.setRoot('home-page');
      }
      //debugger;
     });
    console.log('ionViewDidLoad LandingPage');
  }
  doSignIn() {
    this.navCtrl.push(LoginPage);
  }
  doSignUp() {
    this.navCtrl.push(SignupPage);
  }
}
