import { Component, OnInit ,Output, Input, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BatchVar } from '../../Constants/batch.var';
import { API_URL } from '../../Constants/api_url';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import {CommonService,AlertService,HttpService,UtilService,HeaderService,UserService,CourseService,ResortService} from '../../services';
import * as moment from 'moment';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-add-batch',
    templateUrl: './add-batch.component.html',
    styleUrls: ['./add-batch.component.css']
})

export class AddBatchComponent implements OnInit {
    @Output() someEvent = new EventEmitter<string>();
    @Input() courseList: any = [];
    courseIds=[];
    durationValue = '1';
    maxdurationCount;
    countCheck = false;
    countError;
    reminder;
    status='';
    errStatus=false;
    errMsg;
    showToDate = false;
    showFromDate = false;
    dateError = false;
    submitted = false;
    allEmployees = {};
    employeesInBatch = [];
    userData;

    constructor(private alertService: AlertService,private courseService: CourseService,private utilService:UtilService,private resortService:ResortService,private userService: UserService,private headerService: HeaderService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router, private commonService:CommonService,public commonLabels : CommonLabels) {
        this.batchVar.url = API_URL.URLS;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.batchVar.batchId = params['batchId'];
        });

    }


    ngOnInit() {
      this.batchVar.batchId ? this.headerService.setTitle({ title: this.commonLabels.titles.editTitle, hidemodule: false }) : '';
        this.batchVar.moduleForm=[];
        this.courseForm();
        this.userData =this.utilService.getUserData();
        //get Resort list
        const resortId = this.userData.Resorts[0].resortId; 
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            this.batchVar.resortList=result.data.Resort;
            this.batchVar.divisionList=result.data.divisions;

        })

        //get percentage list
        this.http.get(this.batchVar.url.getPercentageList).subscribe((data) => {
            this.batchVar.percentageList = data.passPercentage;
        });

        //let startDate = localStorage.getItem('BatchStartDate');
        //   let startDate = new Date(); 
        //   this.batchVar.batchFrom= this.splitDate(startDate).toISOString();
        //   this.batchVar.min =this.splitDate(new Date());
        this.batchVar.batchFrom = new Date();
        this.getBatchDetail();
    }

    selectFilter(data) {
        let startDate = localStorage.getItem('BatchStartDate');
        return data.value >= new Date(startDate);
    }

    courseForm(){
      this.courseIds = this.courseList.map(a => a.courseId);
      this.courseList.forEach((item,key) => {
        let obj = {
                 'courseId': item.courseId,
                 'courseName': item.courseName,
                 'passPercentage':"null",
                 'mandatory' :"true"
                }
         this.batchVar.moduleForm.push(obj);
     });
    }

    errorCheck() {
        let now = moment(this.batchVar.batchFrom);
        let end = moment(this.batchVar.batchTo);
        let duration = moment.duration(end.diff(now));
        var days = duration.asDays();
        if (days < 0) {
            this.dateError = true;
        }
        else {
            this.dateError = false;
        }
    }

    durationUpdate() {
        if (this.durationValue === '1') {
            this.maxdurationCount = 60;
        }
        else if (this.durationValue === '2') {
            this.maxdurationCount = 24;
        }
        else {
            this.maxdurationCount = 500;
        }
        this.countErrorCheck();
    }

    countErrorCheck() {
        if (this.durationValue === '1' && this.reminder > 60) {
            this.countCheck = true;
            this.countError = this.commonLabels.mandatoryLabels.minCountError;
        }
        else if (this.durationValue === '2' && this.reminder > 24) {
            this.countCheck = true;
            this.countError = this.commonLabels.mandatoryLabels.hourCountError;
        }
        else {
            this.countCheck = false;
            this.countError = "";
        }
    }

    //get edit batch details
    getBatchDetail() {
        this.http.get(this.batchVar.url.getNewBatchList).subscribe((data) => {
            this.batchVar.batchList = data.batchDetails;
            if (this.batchVar.batchId) {
                let batchObj = this.batchVar.batchList.find(x => x.batchId === parseInt(this.batchVar.batchId));
                this.batchVar.selectedEmp = batchObj.employeeIds;
                this.batchVar.batchFrom = new Date(batchObj.fromDate);
                this.batchVar.batchTo = new Date(batchObj.toDate);
                this.batchVar.batchName = batchObj.batchName;
                this.batchVar.moduleForm = batchObj.moduleDetails;
                this.durationValue = batchObj.notification.durationType;
                this.reminder = batchObj.notification.durationValue;
            }
        });
    }
    

    onEmpSelect(event,key) {
        this.batchVar.employeeId = this.batchVar.selectedEmp.map(item => { return item.employeeId });
        this.batchVar.departmentId = this.batchVar.selectedDepartment.map(item => { return item.departmentId });
        this.batchVar.divisionId = this.batchVar.selectedDivision.map(item => { return item.divisionId });

        if(key == 'div'){
            const obj={'divisionId': this.batchVar.divisionId};
            this.commonService.getDepartmentList(obj).subscribe((result)=>{
            if(result.isSuccess){
                this.batchVar.departmentList = result.data.rows;
                }
            })
        }
       
        if(key == 'dept'){
        const data={'divisionId': this.batchVar.divisionId, 'departmentId':  this.batchVar.departmentId, 'createdBy':this.utilService.getUserData().userId}
         this.userService.getUserByDivDept(data).subscribe(result=>{
                if(result && result.data){
                this.batchVar.employeeList = result.data;        
                this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj) ,{});
            }
            
         })
        }

        if(key == 'emp'){
            if(event.userId && this.allEmployees[event.userId] ){
                this.employeesInBatch.push(this.allEmployees[event.userId]);
            } 
        }

        this.batchVar.empValidate = false;
    }

    onEmpDeSelect(event) {
        console.log(event,"Deselected EVENT");

        if(event.userId){
            const newArray = this.employeesInBatch.filter(item => item.userId != event.userId);
            console.log("newArray", newArray);
            this.employeesInBatch = newArray;

        }
       console.log("this.employeesInBatch", this.employeesInBatch);
    }

    
    splitDate(date) {
        const newDate = new Date(date);
        const y = newDate.getFullYear();
        const d = newDate.getDate();
        const month = newDate.getMonth();
        const h = newDate.getHours();
        const m = newDate.getMinutes();
        return new Date(y, month, d, h, m);
    }

    fromDateChange(date) {
        //  let fromDate=date.toISOString();
        this.batchVar.batchFrom = date;
    }
    dateInputClick() {
        this.showToDate = !this.showToDate;
    }
    fromDateInputClick() {
        this.showFromDate = !this.showFromDate;
    }

    toDateChange(date) {
        this.batchVar.batchTo = date;
    }

    autoHide(data) {
        let value = data[1];
        if (value === 'dl-abdtp-date-button') {
            this.showToDate = false;
            this.showFromDate = false;
        }
    }


    //submit batch
    addBatch(form) {
        this.errStatus= false;
        this.submitted = true;
        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        this.batchVar.dategreater = Date.parse(this.batchVar.batchFrom) > Date.parse(this.batchVar.batchTo) ? true : false;
        this.status = ( this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd') == this.datePipe.transform(new Date(), 'yyyy-MM-dd') ) ? 'assigned' : 'unassigned';
        if (this.batchVar.batchFrom && this.batchVar.batchTo && this.batchVar.batchName && this.batchVar.employeeId && this.batchVar.moduleForm && this.durationValue && this.reminder) {
          //  this.batchVar.moduleForm.forEach(function(course){ delete course.courseName });
            let postData = {
                createdBy : this.userData.userId,
                assignedDate: this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd'),
                dueDate: this.datePipe.transform(this.batchVar.batchTo, 'yyyy-MM-dd'),
                name: this.batchVar.batchName,
                status: this.status,
                notificationDays: this.reminder,
                resort:{
                    "resortId": this.batchVar.selectedResort,
                    "courses":  this.courseIds,
                    "users": this.employeesInBatch
                 },
                courses: this.batchVar.moduleForm,
            }
            this.courseService.scheduleTraining(postData).subscribe(result=>{
                if(result.isSuccess){ 
                        //   this.clearBatchForm();
                          this.hidePopup('submit');
                          this.alertService.success(result.message);                        
                }else{
                    this.errStatus= true;
                    this.errMsg= result.error;
                }
            })
        }
    }

    hidePopup(data){
        this.clearBatchForm();
        console.log(data)
        this.someEvent.next(data);
    }

    clearBatchForm() {
        this.batchVar.moduleForm = [{
            'courseId': "",
            'courseName': "",
            'passPercentage':"null",
            'mandatory' :"true"
        }];
        this.batchVar.batchFrom = '';
        this.batchVar.batchTo = '';
        this.batchVar.batchName = '';
        this.batchVar.selectedEmp = [];
        this.batchVar.selectedResort=null;
        this.batchVar.selectedDivision =[];
        this.batchVar.selectedDepartment=[];
    }

  

    //dynamic remove module fields
    removeForm(i) {
        this.batchVar.moduleForm.splice(i, 1);
    }

    //dynamic add module fields 
    addForm() {
        let obj = {
            moduleId: 1,
            program: "null",
            passpercentage: "null",
            mandatory: "true",
        };
        this.batchVar.moduleForm.push(obj);
    }
    



}
