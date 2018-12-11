import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
  name: 'accomplishment-page'
})
@Component({
  selector: 'page-accomplishment',
  templateUrl: 'accomplishment.html',
  providers:[Constant]
})
export class AccomplishmentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public constant:Constant) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccomplishmentPage');
  }

}
