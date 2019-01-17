import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
@IonicPage({
  name: 'calendar-page'
})
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage implements OnInit {
  calendars = [];
  calendarIdUnique;
  calendarShowEnable: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar, private plt: Platform, private http: HttpProvider, public apiUrl: API_URL) {


    console.log('constructor');
    console.log(this.calendarShowEnable);
    console.log(this.calendarIdUnique);

    this.plt.ready().then(() => {
      this.createCalendar();
    });
  }
  ngOnInit() {
    console.log('entered');
    console.log(this.calendarShowEnable);
    console.log(this.calendarIdUnique);
    if (this.calendarShowEnable === true && this.calendarIdUnique) {
      this.navCtrl.setRoot('home-page');
    }
  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad CalendarPage');
  }

  ionViewDidEnter() {

    console.log('ionViewDidEnter');
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
