import { Component,OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
    eventDetail;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    modalRef: BsModalRef;
    @ViewChild('calDetail') modalTemplate : TemplateRef<any>;

    constructor(private modalService: BsModalService, public constant: Constant,public navCtrl: NavController,public storage: Storage, public http: HttpProvider,private alertCtrl: AlertController) { }

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
    this.navCtrl.push('event-page');
    }
 
   //set month name
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

   //Event detail modal
    onEventSelected(event) {
      this.openModal(this.modalTemplate,event);
    }


  openModal(template: TemplateRef<any>,event) {
    this.eventDetail = event;
    this.modalRef = this.modalService.show(template);
  }

  navPage(courseId){
   this.modalRef.hide(); 
   let paramsData = {};
   paramsData['courseId'] = courseId;
   paramsData['trainingScheduleId'] = this.eventDetail && this.eventDetail['scheduleId'];
   this.navCtrl.push('training-page',paramsData);   
  }

    onTimeSelected(ev) {
        this.selectedDay = ev.selectedTime;
    }

    changeMonth(direction){ 
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
            console.log(value,"VALUE");
            events.push({
                title: value.name,
                startTime: new Date(value.assignedDate),
                endTime: new Date(value.dueDate),
                allDay: true,
                courses: value.Courses,
                scheduleId : value.trainingScheduleId
            });
          })      
          this.eventSource = events;
       }
     });
   }
}