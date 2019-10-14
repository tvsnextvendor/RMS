import { Component ,OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';
import {SocketService,LoaderService} from '../../service';
import {Storage} from '@ionic/storage';
import * as moment from 'moment';


@IonicPage({
  name: 'notification-page'
})
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',

})
export class NotificationPage implements OnInit {
  notificationList;
  currentUser;
  count;
  constructor(public navCtrl: NavController,public storage:Storage,public loader:LoaderService,public navParams: NavParams,public socketService: SocketService, public http: HttpProvider, public API_URL: API_URL,public constant:Constant) {
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
             // this.readAllNotification();
            }
        });  
  }

  ionViewDidLoad() { 
  }


  // readAllNotification(){
  //   let userId = this.currentUser.userId;
  //   this.http.put(false, API_URL.URLS.readAllNoti+ '/' + userId).subscribe((res) => {
  //   }, (err) => {
  //   });
  // }

  saveItem(notification){
  setTimeout(() => {
   this.notificationList.filter((key, index)=>{
     if(key.notificationId ==  notification.notificationId){
       this.notificationList.splice(index, 1);       
     }
   })
  },500)

   let data = {
       "status": "Read"
   }

   this.http.put(false, API_URL.URLS.readNotification + '/' + notification.notificationId, data).subscribe((res) => {
     this.getNotification();
   }, (err) => {
   });

  }


  getNotification(){    
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId,
      domain : 'mobile'
    };
    // this.loader.showLoader();
    this.socketService.getNotification(socketObj).subscribe((data)=>{
     if(data['rows']){
      this.notificationList = data['rows'];
      this.count = data['count'];
     }else{
       this.count = 0;
     }
    // this.loader.hideLoader();
   });
  }

  calculateHours(date){
    var a = moment(new Date(date));
    var b = moment(new Date());
    let day =  a.from(b, true) // "2 days ago"
    var temp = day.split(" ")//now you have 3 words in temp
    if(temp[0] == 'a' || temp[0] == 'an'){
      temp[0] = '1';
    }
    return temp[0] + temp[1].charAt(0); // return as 2d
  }

  redirect(notification){
    let type = notification.type;
    switch (type) {
      case "expireCourse":
      case "expiryNotifyToEmployees":
      case "expiryNotifyToManagers":
      case "assignCourse":
        this.navCtrl.push('course-page');
        break;
      case "failedCourse":
        this.navCtrl.push('course-failed-page');
        break;
      default:
        this.navCtrl.push('course-page');
        break;
      //  this.navCtrl.push('forum-page');
      //   break;
    }   
  }

}
