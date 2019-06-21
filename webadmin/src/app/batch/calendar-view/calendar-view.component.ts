import { Component, OnInit,TemplateRef,ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HeaderService,UtilService,CourseService,BreadCrumbService,AlertService} from '../../services';
import {BatchVar} from '../../Constants/batch.var';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var';
import { AddBatchComponent } from '../add-batch/add-batch.component'



@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.css']
})

export class CalendarViewComponent implements OnInit {
    @ViewChild(AddBatchComponent) batchComponent : AddBatchComponent;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    activeDayIsOpen : boolean;
    events: CalendarEvent[] = [];
    resortId;
    trainingScheduleId;
    scheduleEditDetails = {};
    enableBatch = false;
    currentUrl ;
    modalConfig;
    modalRef;
    removeScheduleId;

  
   constructor(
    private headerService:HeaderService,
    public batchVar: BatchVar,
    private router:Router,
    private modalService:BsModalService,
    public commonLabels:CommonLabels,
    private utilService : UtilService,
    private courseService : CourseService,
    private breadCrumbService : BreadCrumbService,
    private activatedRoute :ActivatedRoute,
    private alertService : AlertService){
    this.batchVar.url = API_URL.URLS; 
    this.activatedRoute.queryParams.forEach(items=>{
        this.currentUrl = items.type
    })
   }

    ngOnInit(){
        this.headerService.setTitle({title:this.commonLabels.labels.schedule, hidemodule: false});
        this.breadCrumbService.setTitle([]);
        let user = this.utilService.getUserData();
        this.resortId = user.ResortUserMappings && user.ResortUserMappings[0].Resort.resortId;
        this.getCalendarDetails();
    }

    ngDoCheck(){
        if(!this.currentUrl){
            this.enableBatch = false;
        }
    }

    goToBatch(event,scheduleId,i,addBatch){
        this.pageUpdate(event,scheduleId,i,addBatch);
        this.router.navigate(['/calendar'],{queryParams : {type:'edit'}})
 
    }

    goToDelete(){
        // console.log(event ,i)
        let scheduleId = this.removeScheduleId;
        this.courseService.removeSchedule(scheduleId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.alertService.success(resp.message);
                this.getCalendarDetails();
                this.closePopup();
            }
        },err=>{
            this.alertService.error(err.error.error)
        })
    }

    pageUpdate(event,scheduleId,i,addBatch){
        localStorage.setItem('BatchStartDate',event);
        console.log(event,scheduleId)
        if(Object.keys(scheduleId)){
            this.getScheduleData(scheduleId.id);
            // this.openEditModal(addBatch,event)
        }
        // this.router.navigateByUrl('/addBatch');
    }


    getScheduleData(id){
        this.courseService.getPopupSchedule(id).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.trainingScheduleId = resp.data.length ? resp.data[0].trainingScheduleId : '';
                this.scheduleEditDetails = resp.data.length ? resp.data[0] : {};
                this.enableBatch =true
            }
            // console.log(resp)
        })
    }

    getCalendarDetails(){
        this.courseService.getCalendarSchedule(this.resortId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                // console.log(resp);
                let scheduleData = resp.data.length && resp.data;
                let tempArray = [];
                scheduleData.map(item => {
                    let obj = {
                        start       : new Date(item.assignedDate),
                        dueDate : new Date(item.dueDate),
                        // end         : new Date(item.dueDate),
                        batchName   : item.name,
                        moduleCount : resp.data.length,
                        courseCount : item.Courses.length,
                        courseList  : item.Courses, 
                        // timings     : fromTime +'-' + toTime ,
                        id          : item.trainingScheduleId, 
                    }
                    tempArray.push(obj);
                 })
                 this.events=tempArray;
            }
            else{
                this.events = [];
            }
        })
    }

    openEditModal(template: TemplateRef<any>, forum) {
        let modalConfig={
            class : "modal-xl"
          }
        this.batchVar.modalRef = this.modalService.show(template,modalConfig);
    }

    closeModel(){
        // this.batchVar.modalRef.hide();
        this.enableBatch = false;
        this.breadCrumbService.setTitle([]);
        this.trainingScheduleId = '';
        this.scheduleEditDetails = {};
        this.getCalendarDetails();
    }

    goToCMSLibrary(){
        this.router.navigate(['/cms-library'],{queryParams:{type : 'create',tab : 'schedule'}})
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if(events.length === 0){
            var n = date.toString();
            localStorage.setItem('BatchStartDate',n);
            this.goToCMSLibrary();
        }
      }

      closePopup(){
        this.modalRef.hide();
        this.removeScheduleId = '';
      }

      openConfirmModel(template: TemplateRef<any>,event) {
          this.removeScheduleId = event.id;
        this.modalRef = this.modalService.show(template,this.modalConfig);
      }
}
