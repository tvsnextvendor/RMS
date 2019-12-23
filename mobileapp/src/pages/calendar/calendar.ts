import { Component,OnInit, TemplateRef, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { LoaderService } from '../../service';
import { Storage } from '@ionic/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
    modaleventDetail;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    modalRef: BsModalRef;
    @ViewChild('calDetail') modalTemplate : TemplateRef<any>;

    constructor(private modalService: BsModalService, public constant: Constant,public navCtrl: NavController,public storage: Storage, public http: HttpProvider,public loader:LoaderService) { }

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
    // this.navCtrl.push('event-page');
    this.navCtrl.pop();
    }
 
   //set month name
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    goPrint(obj){
      console.log(obj,"OBJ")
    }

   //Event detail modal
    onEventSelected(event) {
      this.modaleventDetail = event;
      this.openModal(this.modalTemplate,event);
    }

  

  openModal(template: TemplateRef<any>,event) {
    this.modaleventDetail = event;
    this.modalRef = this.modalService.show(template);
  }

  navPage(courseId){
   this.modalRef.hide(); 
   let paramsData = {};
   paramsData['courseId'] = courseId;
   paramsData['trainingScheduleId'] = this.modaleventDetail && this.modaleventDetail['scheduleId'];
   this.navCtrl.push('training-page',paramsData);   
  }

  goToNoti(detail){
    this.modalRef.hide();
    let userId = this.currentUser.userId;
    let resortId = this.currentUser.ResortUserMappings[0].resortId;
    let status = 'signRequired';
    this.http.get(API_URL.URLS.signRequired + '?userId=' + userId + '&resortId=' + resortId + '&status=' + status + '&notificationFileId=' + detail.notificationFileId +'&mobile=' + 1).subscribe(res => {
        if (res['data']['rows'].length) {
             let data = res['data']['rows'][0];
             let postData = {
                 'type': 'signReq',
                 'notificationFileId': detail.notificationFileId,
                 'fileStatus': data.NotificationFileMaps && data.NotificationFileMaps[0].status
             }
             if (data.description) {
                 postData['description'] = data.description;
             } else {
                 postData['files'] = data.File;
                 postData['uploadPath'] = res['data']['uploadPath']['uploadPath'];
             }
             this.navCtrl.push('signrequire-page', postData);
        }
       
    });
    
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

  //  filterEvents(data){
  //   console.log(data,"Data")
  //   let filterArray = [];
  //    data.filter((value,index) => {
  //       //console.log(value.startTime)
  //       let date = moment(value.startTime).format('DD-MM-YYYY');
  //       let time = moment(value.startTime).format('HH: mm');
  //       //console.log(date, time)
  //         let filteredData = data.filter((t,i) => {
  //             let date1 = moment(t.startTime).format('DD-MM-YYYY');
  //             let time1 = moment(t.startTime).format('HH: mm');
  //            // console.log(date1 , date)
  //               if(date1 == date){
  //                 filterArray.push(t);
  //               }
  //         })
  //       console.log(filterArray,"FILTERED DATA")
  //   }) 
  //   data = data.filter((value, index, self) =>
  //       index === self.findIndex((t) => (
  //           t.startTime === value.startTime
  //       ))
  //   )
  //  console.log(data, "FILTERED");
  //}

    getSchedule() {
      let userId = this.currentUser ? this.currentUser.userId : 8;
      let resortId = this.currentUser.ResortUserMappings[0].resortId;
      this.loader.showLoader();
      this.http.get(API_URL.URLS.getScheduleTraining+ '?userId=' + userId + '&resortId=' + resortId).subscribe((res) => {
        if (res['isSuccess']) {
          let dataList = res['data'];
          let events = [];
          dataList.map(value=>{
           let todaysDate = new Date(value.assignedDate);
           let endDate = todaysDate.setDate(todaysDate.getDate() + 1);
            events.push({
                title: value.name,
                startTime: new Date(value.assignedDate),
                endTime: new Date(endDate),
                endDate: new Date(value.dueDate),
                allDay: true,
                scheduleType: value.scheduleType,
                courses: value.Courses,
                colorCode:value.colorCode,
                scheduleId : value.trainingScheduleId,
                status: value.Resorts[0].status,
                notificationDetail : value.scheduleType == 'notification' ? value.Resorts[0].NotificationFile : '' 
            });
          })    
          
          // let filtered = this.filterEvents('startTime', events);
          // console.log(filtered,"FILTERED")
          this.eventSource = events;
       }
       this.loader.hideLoader();
     });
   }
 
  filterEvents(prop,originalArray) {
    var newArray = [];
    var lookupObject = {};
    console.log(originalArray,"Original Array")
    for (var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }   
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
  }
   
  
  // filterEvents(propertyName, inputArray) {
  //   console.log(inputArray)
  //      var seenDuplicate = false,
  //          testObject =[];
   
  //      inputArray.map(function(item) {
  //          var itemPropertyName = item[propertyName];
  //          console.log(itemPropertyName,"name");
  //          if (itemPropertyName in testObject) {
  //              testObject[itemPropertyName].duplicate = true;
  //              item.duplicate = true;
  //              seenDuplicate = true;
  //          }
  //          else {
  //              testObject.push(item);
  //              delete item.duplicate;
  //          }
  //      });
     
  //      console.log(testObject,"TEST")
  //      return seenDuplicate;
  //  }
   
}