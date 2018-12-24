import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
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
export class CalendarPage {
  calendars = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar,private plt:Platform,private http:HttpProvider,public apiUrl:API_URL) {
    this.plt.ready().then(() => {
      // this.calendar.listCalendars().then(data => {
      //   this.calendars = data;
      // });
      this.openCalendar();
      this.getCalendars();
   });
  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }
  openCalendar(){
    this.calendar.openCalendar(new Date()).then(
        (msg) => { console.log(msg); },
        (err) => { console.log(err); }
    );
  }
  getCalendars(){
     var self= this;
      this.http.getData(API_URL.URLS.getCalendars).subscribe((data) => {
        if (data['isSuccess']) {
          this.calendars = data['calendarList'];
          this.calendars.map(function(value,key){
              self.addEventWithOptions(value);
          });
        }
      });
  }

  addEventWithOptions(cal){
    return new Promise((resolve, reject) => {
      let options    = { calendarId: cal.calendarId, calendarName: cal.calendarName, url: cal.url ,firstReminderMinutes:15 };
      var startDate  = this.getDate(cal.startDate);
      var endDate    = this.getDate(cal.endDate);
      var startDates = new Date(startDate['year'],startDate['month'],startDate['date'],0,0,0,0); // beware: month 0 = january, 11 = december
      var endDates   = new Date(endDate['year'],endDate['month'],endDate['date'],0,0,0,0);  
      console.log(cal);
      console.log("function call");

      this.calendar.findEventWithOptions(cal.title,cal.location,cal.notes, startDates, endDates, options).then(resp=>{
        console.log("find event resp",startDates,endDates);
        console.log(resp);
        console.log(resp.length);
        if(resp.length === 0){
          this.calendar.createEventWithOptions(cal.title, cal.location, cal.notes, startDates, endDates, options).then(res => {
            console.log("create event resp",startDates,endDates);
            console.log(res);
            resolve(resp);
          }, err => {
            reject(err);
            console.log('create err: ', err);
          });
        }
      }, err => {
        reject(err);
        console.log('find err: ', err);
      });
    });
  }

  getDate(dateFormat){
     let date = dateFormat.split('-');
     let resp = {};
     resp['year'] = date[0];
     resp['month'] = date[1];
     resp['date'] = date[2];
     return resp;
  }
}
