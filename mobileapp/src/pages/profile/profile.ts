import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
  name: 'profile-page'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [Constant]
})
export class ProfilePage implements OnInit {
  currentUser;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public constant: Constant) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.getDetails();
  }
  ngOnInit() {

  }
  getDetails() {
    let self = this;
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          self.currentUser = val
        }
        console.log(this.currentUser);
      }, (err) => {
        console.log('currentUser not received in profile.component.ts', err);
      });
  }

}
