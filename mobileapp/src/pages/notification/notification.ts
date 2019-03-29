import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';
import { LoaderService } from '../../service/loaderService';

@IonicPage({
  name: 'notification-page'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage implements OnInit {
  notificationList: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public API_URL: API_URL,public constant:Constant, private loader: LoaderService) {
  }
  ionViewDidEnter() {
    this.getNotification();
  }
  ngOnInit(){
   
  }
  ionViewDidLoad() { 
    console.log('ionViewDidLoad NotificationPage');
  }
  getNotification() {
    this.loader.showLoader();
    this.http.getData(API_URL.URLS.getNotification).subscribe((data) => {
      if (data['isSuccess']) {
        this.notificationList = data['NotificationList'];
      }
      this.loader.hideLoader();
      console.log(this.notificationList);
    });
  }
}
