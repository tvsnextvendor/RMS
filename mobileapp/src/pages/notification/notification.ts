import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';
import { LoaderService } from '../../service/loaderService';
import {SocketService} from '../../service';
import {Storage} from '@ionic/storage';
import * as moment from 'moment';


@IonicPage({
  name: 'notification-page'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers:[SocketService]

})
export class NotificationPage implements OnInit {
  notificationList;
  currentUser;
  constructor(public navCtrl: NavController,public storage:Storage, public navParams: NavParams,public socketService: SocketService, public http: HttpProvider, public API_URL: API_URL,public constant:Constant, private loader: LoaderService) {
  }
  ionViewDidEnter() {       
  }
  ngOnInit(){    
  }

   ngAfterViewInit() {
      let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
             this.getNotification();
            }
        });  
  }

  ionViewDidLoad() { 
  }


  getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
     console.log(data,"dcjhdsbchjdcjbdhjcbdschdsb")
      this.notificationList = data.notifications.rows;
   });
  }

  calculateHours(date){
    let now = moment(new Date()); //todays date
    var duration = moment.duration(now.diff(date));
    var days = duration.asHours();
    console.log(days)
    return days;
  }

  redirect(notification){
    let type = notification.type;
    if(type == "assignCourse"){
      this.navCtrl.setRoot('course-page');
    }else{
     this.navCtrl.setRoot('forum-page');
    }
  }

  // getNotification() {
  //   this.loader.showLoader();
  //   this.http.getData(API_URL.URLS.getNotification).subscribe((data) => {
  //     if (data['isSuccess']) {
  //       this.notificationList = data['NotificationList'];
  //     }
  //     this.loader.hideLoader();
  //     console.log(this.notificationList);
  //   });
  // }
}
