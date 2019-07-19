import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import {LoaderService, SocketService} from '../../service';
import * as moment from 'moment';
import { Calendar } from '@ionic-native/calendar';


@IonicPage({
  name: 'event-page'
})
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage implements OnInit {

  notificationCount;
  currentUser;
  scheduleList = [];
  enableIndex;
  enableView;
  totalPage;
  calendarIdUnique;
  calendars;
  scheduleDetail;
  batches: any = [];
  batchconfigList: any = [];
  tag: boolean = false;
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.five;
  

  constructor(public navCtrl: NavController,public calendar: Calendar,public socketService: SocketService ,public storage: Storage, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {
  }

  ngOnInit(){
    
  }
  
  ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
              this.getNotification();
              this.getBatch();
            }
        });
  }
  
  
  openSubEvent(i, scheduleId) {
    let userId = this.currentUser.userId;
    this.http.get(API_URL.URLS.getScheduleDetail + '?userId=' + userId + '&trainingScheduleId=' + scheduleId).subscribe(res => {
        if (res['isSuccess']) {
            this.scheduleDetail = res['data'];
        }
    })
      this.enableView = this.enableIndex === i ? !this.enableView : true;
      this.enableIndex = i;     
  }

 
  //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.getBatch();
            event.complete(); //To complete scrolling event.
        }, 1000);
    }

    retakeCourse(courseId){
      let paramsData= {};
      paramsData['courseId'] = courseId;
      this.navCtrl.setRoot('training-page', paramsData);
    }

  getBatch() {
    //  this.loader.showLoader();
    let userId = this.currentUser.userId;
    this.http.get(API_URL.URLS.getAllSchedule+'?userId='+userId+ '&page=' + this.currentPage + '&size=' + this.perPageData).subscribe(res=>{
      if(res['isSuccess']){
        let totalData = res['data']['count'];
        this.totalPage = totalData / this.perPageData;
        if (this.scrollEnable) {
            for (let i = 0; i < res['data']['rows'].length; i++) {
                this.scheduleList.push(res['data']['rows'][i]);
            }
        }else{
            this.scheduleList = res['data']['rows'];
        }
      }
      //this.loader.hideLoader();
    })
  }
 
  redirectPage(courseId, scheduleId){
    let paramsData={};
    paramsData['courseId'] = courseId;
    paramsData['trainingScheduleId'] = scheduleId;
    this.navCtrl.setRoot('training-page', paramsData);
  }
   
  calculateAvgScore(data){
     let score= 0;
     data.map(key=>{
       score+= parseInt(key.passPercentage);
     });
     let avgScore = score/ data.length;
     return avgScore.toFixed(0);
  }

calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return a.to(b, true);
  }

    getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
      this.notificationCount = data['unReadCount'];
   });
  }

  goToForum(){
     this.navCtrl.setRoot('forum-page');
  }
   
  goToNotification() {
    this.navCtrl.setRoot('notification-page');
  }

  goToCalendar(){
    this.navCtrl.setRoot('calendar-page');
  }


}
