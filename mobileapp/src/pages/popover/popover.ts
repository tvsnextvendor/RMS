import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController,NavParams } from 'ionic-angular';

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  selectedOption;
  status;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.status = this.navParams.get('status');
    this.selectedOption = this.navParams.get('filterData');
  }

  changeOption(){
  }
  

  applyFilter(){
    let postData = {
        filterData: this.selectedOption,
        status: this.status
    }
    this.viewCtrl.dismiss(postData);
  }

  clearFilter(){
     let postData = {
         filterData: '',
         status: this.status
     }
     this.viewCtrl.dismiss(postData);
  }

}
