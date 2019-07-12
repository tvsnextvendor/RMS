import { Component, OnInit,TemplateRef,ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HeaderService,UtilService,CourseService,BreadCrumbService,AlertService,CommonService,ResortService} from '../../services';
import {BatchVar} from '../../Constants/batch.var';
import {startOfDay,endOfDay,subDays,subWeeks,subMonths,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView,CalendarMonthViewDay} from 'angular-calendar';
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
    networkResortId;
    trainingScheduleId;
    scheduleEditDetails = {};
    enableBatch = false;
    currentUrl ;
    modalConfig;
    modalRef;
    removeScheduleId;
    currentDate;
    resortList;
    dayClick;
    roleId;

  
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
    private alertService : AlertService,
    private commonService :CommonService,
    private resortService : ResortService){
    this.batchVar.url = API_URL.URLS; 
    this.activatedRoute.queryParams.forEach(items=>{
        this.currentUrl = items.type
    })
   }

    ngOnInit(){
        this.currentDate = new Date();
        this.currentDate.setHours(0,0,0,0);
        this.dayClick = 1;
        this.roleId = this.utilService.getRole();
        this.headerService.setTitle({title:this.commonLabels.labels.schedule, hidemodule: false});
        this.breadCrumbService.setTitle([]);
        let user = this.utilService.getUserData();
        this.resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
        this.getCalendarDetails();
        if(this.roleId){
            this.resortService.getResort().subscribe(item=>{
                if(item && item.isSuccess){
                    this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                }
            })
        }
        else{
            this.commonService.getResortForFeedback(this.resortId).subscribe((result) => { 
                if(result && result.isSuccess){
                    this.resortList = result.data && result.data.rows.length ? result.data.rows : [];
                }
            });
        }
    }

    ngDoCheck(){
        if(!this.currentUrl){
            this.enableBatch = false;
            this.breadCrumbService.setTitle([]);
        }
    }

    goToBatch(event,scheduleId,i,addBatch){
        if(addBatch == "editBatch"){
            this.pageUpdate(event,scheduleId,i,addBatch);
            this.router.navigate(['/calendar'],{queryParams : {type:'edit'}})
            this.dayClick = 2;
        }
        else if(addBatch == 'addBatch' && this.dayClick == 1){
            this.dayClicked(event);
        }
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
            this.closePopup();
            this.alertService.error(err.error.error);
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
                this.networkResortId = this.roleId == 1 ? resp.data[0].Resorts.length && resp.data[0].Resorts[0].resortId : '';
                this.enableBatch =true
            }
            // console.log(resp)
        },err=>{
            this.dayClick = 1;
        })
    }
    getCalendarDetails(){
        let roleId = this.utilService.getRole();
        let user = this.utilService.getUserData();
        this.dayClick = 1;
        let query = roleId != 1 ? this.resortId+"&createdBy="+user.userId : ''
        this.courseService.getCalendarSchedule(query).subscribe(resp=>{
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
        this.dayClick = 1;
        this.getCalendarDetails();
    }

    goToCMSLibrary(){
        this.router.navigate(['/cms-library'],{queryParams:{type : 'create',tab : 'schedule'}})
    }

    // dateIsValid(date: Date): boolean {
    // return date >= this.currentDate;
    // }

    // beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    //     body.forEach(day => {
    //         console.log(day.date < this.currentDate)
    //         if (day.date < this.currentDate) {
    //             day.cssClass = 'cal-disabled';
    //         }
    //     });
    // }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if(date>=this.currentDate){
            var n = date.toString();
            localStorage.setItem('BatchStartDate',n);
            this.goToCMSLibrary();
        }
        else if(date<this.currentDate){
            this.alertService.info('Schedule date should be greater than current date')
        }
      }

      closePopup(){
        this.modalRef.hide();
        this.removeScheduleId = '';
        this.dayClick = 1;
      }

      openConfirmModel(template: TemplateRef<any>,event,i) {
          this.dayClick = 2;
          this.removeScheduleId = event.id;
        this.modalRef = this.modalService.show(template,this.modalConfig);
      }
      ngOnDestroy(){
        this.dayClick = 1;
      }
}
