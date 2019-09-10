import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import {LoaderService} from '../../service';
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

  currentUser;
  scheduleList = [];
  enableIndex;
  enableView;
  totalPage;
  calendarIdUnique;
  calendars;
  courseScheduleDetail;
  classScheduleDetail;
  batches: any = [];
  batchconfigList: any = [];
  tag: boolean = false;
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.ten;
  

  constructor(public navCtrl: NavController,public calendar: Calendar,public storage: Storage, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {
  }

  ngOnInit(){
    
  }
  
  ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
              this.getBatch();
            }
        });
  }
  
  
  openSubEvent(i, data) {
    let userId = this.currentUser.userId;
    const scheduleData = data.Courses[0];
    this.courseScheduleDetail=[];
    this.classScheduleDetail=[];
    let courseClassId = scheduleData.courseId ? '&courseId=' +scheduleData.courseId : '&trainingClassId=' +scheduleData.trainingClassId;
    this.http.get(API_URL.URLS.getScheduleDetail + '?userId=' + userId + '&trainingScheduleId=' + data.trainingScheduleId +courseClassId).subscribe(res => {
        if (res['isSuccess']) {
             if(scheduleData.courseId){
              this.courseScheduleDetail =  res['data']['course']; 
             }else{
              this.classScheduleDetail = res['data']['class'];
             }
        }
    })
      this.enableView = this.enableIndex === i ? !this.enableView : true;
      this.enableIndex = i;     
  }

 
   //Infinite scroll event call
    doInfinite(event) {      
        setTimeout(() => {
            this.currentPage += 1;
            this.scrollEnable = true;
            this.getBatch();
            event.complete(); //To complete scrolling event.
        }, 10000);
    }

   

  getBatch() {
    this.loader.showLoader();
    let userId = this.currentUser.userId;
    // + '&page=' + this.currentPage + '&size=' + this.perPageData
    this.http.get(API_URL.URLS.getAllSchedule+'?userId='+userId).subscribe(res=>{
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
      this.loader.hideLoader();
    })
  }
 
  //For scheduled course
  redirectTCPage(courseId, scheduleId){
    let paramsData={};
    paramsData['courseId'] = courseId;
    paramsData['trainingScheduleId'] = scheduleId;
    this.navCtrl.push('training-page', paramsData);
  }

  //For scheduled class
  redirectFilesPage(trainingClassId,scheduleId){
    let paramsData = {};
    paramsData['trainingClassId'] = trainingClassId;
    paramsData['trainingScheduleId'] = scheduleId;
    paramsData['setData']={};
    paramsData['setData']['typeSet']="Class";
    this.navCtrl.push('trainingdetail-page', paramsData);
  }
   
  calculateAvgScore(data){
     let score= 0;
     data.map(key=>{
       score+= parseInt(key.passPercentage);
     });
     let avgScore = score/ data.length;
     return avgScore.toFixed(0);
  }


  calculateExpireDays(duedate) {
    let dueDate = moment(duedate).format("YYYY-MM-DD");
    let todaysDate = moment(new Date()).format("YYYY-MM-DD");
    let tomDate = moment(new Date()).add(1,'days').format("YYYY-MM-DD");
    
    if(dueDate == todaysDate){
      let string = "Expires Today"
      return string;
    }else if(dueDate == tomDate){
      let string = "Will expire tomorrow"
      return string;
    }else if(dueDate <= todaysDate){
      let string = "Expired"
      return string;
    }else{
    const a = moment(new Date());
    let string =  this.constant.pages.trainingLabels.willExpire +' ' + a.to(dueDate, true);
    return string;
    }
  }

  

  goToForum(){
     this.navCtrl.push('forum-page');
  }
   
  goToCalendar(){
    this.navCtrl.push('calendar-page');
  }


}
