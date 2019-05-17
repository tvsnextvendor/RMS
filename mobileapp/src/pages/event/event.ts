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
  providers:[SocketService]
})
export class EventPage implements OnInit {
 tag: boolean = false;
  batches: any = [];
  batchconfigList:any=[];
  notificationCount;
  currentUser;

  constructor(public navCtrl: NavController,public calendar: Calendar,public socketService: SocketService ,public storage: Storage, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {
  }
  scheduleList=[];
  enableIndex;
  enableView;
  calendarIdUnique;
  calendars;
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
  
  ionViewDidEnter(){
    
  }
  openSubEvent(i) {
      this.enableView = this.enableIndex === i ? !this.enableView : true;
      this.enableIndex = i;

  }
  getBatch() {
    this.loader.showLoader();
    let userId = this.currentUser.userId;
    this.http.get(API_URL.URLS.getAllSchedule+'?userId='+userId).subscribe(res=>{
      if(res['isSuccess']){
        this.scheduleList = res['data'];
      }
    })
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


  openCalendar() {
    this.calendar.openCalendar(new Date()).then(
      (msg) => {
        console.log("open calendar");
        console.log(msg);
      },
      (err) => {
        console.log("open calendar error");
        console.log(err);
      }
    );
  }
  
  goToNotification() {
    this.navCtrl.setRoot('notification-page');
  }

  goToCalendar(){
    this.createCalendar();
  }
  createCalendar() {
    var self = this;
    this.calendar.createCalendar('RMS Calendar').then(
      (msg) => {
        console.log("write permission");
        self.calendar.hasReadWritePermission().then(
          (res) => {
            console.log("RMS Calendar hasReadWritePermission", res);
            if (!res) {
              self.calendar.requestReadWritePermission().then(
                (resp) => {
                  console.log('Request requestReadWritePermission', resp);
                }
              );
            }
          },
          (err) => { console.log("RMS Calendar hasReadWritePermission error", err); }
        );
        console.log(this.calendar.hasReadWritePermission());
        console.log("write permission")

        this.calendarIdUnique = msg;
        self.openCalendar();
        self.getCalendars();
        console.log("RMS Calendar Created", msg);
      },
      (err) => { console.log("RMS Calendar Creation error", err); }
    );
  }

  deleteCalendar() {
    this.calendar.deleteCalendar('RMS Calendar').then(
      (msg) => { console.log("RMS Calendar Deleted", msg); },
      (err) => { console.log("RMS Calendar Deletion error", err); }
    );
  }
  getCalendars() {
    // var self= this;
    this.http.getData(API_URL.URLS.getCalendars).subscribe((data) => {
      if (data['isSuccess']) {
        this.calendars = data['calendarList'];
        this.loopCalendar(this.calendars);
        // this.calendars.map(function(value,key){
        //     self.addEventWithOptions(value);
        // });
      }
    });
  }
  loopCalendar(calendarArray) {
    var self = this;
    calendarArray.map(function (value, key) {
      self.addEventWithOptions(value).then(function (respCollect) {

        console.log('Total Response Collected here');
        console.log(respCollect);
      });
    });
  }
  addEventWithOptions(cal) {
    return new Promise((resolve, reject) => {
      //,firstReminderMinutes:15
      let options = { calendarId: cal.calendarId, calendarName: cal.calendarName, url: cal.url };
      var startDate = this.getDate(cal.startDate);
      var endDate = this.getDate(cal.endDate);
      var startDates = new Date(startDate['year'], startDate['month'], startDate['date'], 0, 0, 0, 0); // beware: month 0 = january, 11 = december
      var endDates = new Date(endDate['year'], endDate['month'], endDate['date'], 0, 0, 0, 0);
      console.log(cal);
      console.log("function call");

      console.log(options);
      console.log("function call options above one");
      // this.calendar.findEventWithOptions(cal.title, cal.location, cal.notes, startDates, endDates, options).then(resp => {
      // console.log("find event resp", startDates, endDates);

      console.log("function dates", startDates, endDates);
      console.log(cal.title, cal.location, cal.notes, startDates, endDates, options);
      // console.log(resp.length);
      // if (resp.length >= 0){
      this.calendar.createEventWithOptions(cal.title, cal.location, cal.notes, startDates, endDates, options).then(res => {
        console.log("create event resp", startDates, endDates);
        console.log("function hitting only once", cal);
        console.log(res);
        resolve(res);
      }, err => {
        reject(err);
        console.log('create err: ', err);
      });
      // }
      // }, err => {
      //   reject(err);
      //   console.log('find err: ', err);
      // });
    });
  }
  getDate(dateFormat) {
    let date = dateFormat.split('-');
    let resp = {};
    resp['year'] = date[0];
    resp['month'] = date[1] - 1;
    resp['date'] = date[2];
    return resp;
  }

}
