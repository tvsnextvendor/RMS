import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
@IonicPage({
  name: 'event-page'
})
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage implements OnInit {
 tag: boolean = false;
  batches: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL) {
  }
  ngOnInit(){
    this.getBatch();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }
  openSubEvent(i) {
    this.tag = !this.tag;
  }
  getBatch() {
    this.http.getData(API_URL.URLS.getBatch).subscribe((data) => {
      if (data['isSuccess']) {
        this.batches = data['BatchList'];
      }
    });
  }

}
