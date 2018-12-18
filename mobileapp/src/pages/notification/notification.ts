import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
  name: 'notification-page'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage implements OnInit {
  notificationList: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public API_URL: API_URL,public constant:Constant) {
  }
  ngOnInit(){
    this.getNotification();
  }
  ionViewDidLoad() { 
    console.log('ionViewDidLoad NotificationPage');
  }
  getNotification() {
    this.http.getData(API_URL.URLS.getNotification).subscribe((data) => {
      if (data['isSuccess']) {
        this.notificationList = data['NotificationList'];
      }
      console.log(this.notificationList);
    });
  }
}
