import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DescriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  name: 'description-page'
})

@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {
   
   description;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let detailObj = this.navParams.data;
    this.description = detailObj.description;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionPage');
  }
 
  goBack(){
        this.navCtrl.pop();
  }
}
