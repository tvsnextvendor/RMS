import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

@IonicPage({
  name: 'calendar-page'
})
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  calendars = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar,private plt:Platform) {
    this.calendar.createCalendar('MyCalendar').then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
    this.plt.ready().then(() => {
      this.calendar.listCalendars().then(data => {
        this.calendars = data;
      });
    })
    this.openCalendar();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }
  myCalendar() {
    this.calendar.createCalendar('MyCalendar').then(
      (msg) => { console.log(msg); },
      (err) => { console.log(err); }
    );
  }
  openCalendar(){
    this.calendar.openCalendar(new Date()).then(
        (msg) => { console.log(msg); },
        (err) => { console.log(err); }
    );
  }
//   addEvent(){
//     return this.calendar.createEventInteractively("event title");
//    }
// scheduleEvents(){
//     this.calendar.hasReadWritePermission().then((result)=>{
//     if(result === false){
//         this.calendar.requestReadWritePermission().then((v)=>{
//             this.addEvent();
//         },(r)=>{
//             console.log("Rejected");
//         })
//     }
//     else
//     {
//         this.addEvent();
//     }
//     })     
//   }
  addEvent(cal) {
    let date = new Date();
    let options = { calendarId: cal.id, calendarName: cal.name, url: 'https://ionicacademy.com', firstReminderMinutes: 15 };

    this.calendar.createEventInteractivelyWithOptions('My new Event', 'Münster', 'Special Notes', date, date, options).then(res => {
    }, err => {
      console.log('err: ', err);
    });
  }
  openCal(cal) {
    this.navCtrl.push('CalDetailsPage', { name: cal.name })
  }
}
