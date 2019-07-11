import { Component,OnInit} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';


@IonicPage({
    name: 'calendar-page'
})

@Component({
    selector: 'page-calendar',
    templateUrl: 'calendar.html'
})
export class CalendarPage implements OnInit   {
    eventSource = [];
    viewTitle: string;
    currentMonth;
    selectedDay = new Date();
    currentUser;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    constructor(public navCtrl: NavController,public storage: Storage, public http: HttpProvider,private alertCtrl: AlertController) { }

    ngOnInit(){
      this.currentMonth = this.selectedDay.getMonth();  
      let self = this;
      this.storage.get('currentUser').then((user: any) => {
          if (user) {
              self.currentUser = user;
               this.getSchedule();
          }
      });
    }

   //Nav to training schedule
    goBack(){
    this.navCtrl.setRoot('event-page');
    }
 
   //set month name
    onViewTitleChanged(title) {
      console.log(title,"viewTITLE")
        this.viewTitle = title;
    }

   //Event detail modal
    onEventSelected(event) {
        let start = moment(event.startTime).format('MMMM Do YYYY');
        let startday = moment(event.startTime).format('ddd');
        let end = moment(event.endTime).format('MMMM Do YYYY');
        let endday = moment(event.endTime).format('ddd');
        let alert = this.alertCtrl.create({
            title: '' + event.title,
            subTitle: 'From: ' + startday+', '+ start + '<br>To: '+ endday+ ', ' + end,
            buttons: ['OK']
        })
        alert.present();
    }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }

    changeMonth(direction){ 
      console.log(this.calendar); 
      switch(direction){ 
        case "back": 
         this.calendar.currentDate = new Date( this.calendar.currentDate.setMonth(this.currentMonth - 1));
         this.currentMonth = this.currentMonth - 1;
          break;
        case "forward":
         this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.currentMonth + 1)); 
         this.currentMonth = this.currentMonth + 1; 
         break; 
        } 
        console.log(this.calendar["currentDate"]); 
        return this.calendar;
      }

    getSchedule() {
      let userId = this.currentUser ? this.currentUser.userId : 8;
      let resortId = this.currentUser.ResortUserMappings[0].resortId;
      this.http.get(API_URL.URLS.getScheduleTraining+ '?userId=' + userId + '&resortId=' + resortId).subscribe((res) => {
        if (res['isSuccess']) {
          let dataList = res['data'];
          let events = [];
          dataList.map(value=>{
            events.push({
                title: value.name,
                startTime: new Date(value.assignedDate),
                endTime: new Date(value.dueDate),
                allDay: true
            });
          })      
          this.eventSource = events;
          console.log(this.eventSource, "SOURCE");
       }
     });
   }
}