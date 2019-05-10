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
    @Input() scheduleId;
    @Input() scheduleData;
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
    courseDataList = [];
    passPerError; 
    errorValidate;

    constructor(private alertService: AlertService,private courseService: CourseService,private utilService:UtilService,private resortService:ResortService,private userService: UserService,private headerService: HeaderService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router, private commonService:CommonService,public commonLabels : CommonLabels) {
        this.batchVar.url = API_URL.URLS;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.batchVar.batchId = params['batchId'];
        });
    }


    ngOnInit() {
    //   this.scheduleId ? this.headerService.setTitle({ title: this.commonLabels.titles.editTitle, hidemodule: false }) : this.headerService.setTitle({ title: this.commonLabels.titles.addTitle, hidemodule: false });
        this.batchVar.moduleForm=[];
        this.clearBatchVar();
        this.getResortData();
        
        if(this.scheduleId){
            this.getCourseData();
        }
        else{
            this.batchVar.batchFrom = new Date();
            this.courseForm();
        }
        //let startDate = localStorage.getItem('BatchStartDate');
        //   let startDate = new Date(); 
        //   this.batchVar.batchFrom= this.splitDate(startDate).toISOString();
        //   this.batchVar.min =this.splitDate(new Date());
        // this.getBatchDetail();
    }

    getCourseData(){
        this.courseService.getAllCourse().subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.courseDataList = resp.data.rows.length && resp.data.rows.map(item=>{
                    let obj = {
                        courseId : item.courseId,
                        courseName : item.courseName
                    }
                    return obj;
                })
                this.updateScheduleTraining();
            }
        });
    }

    selectFilter(data) {
        let startDate = localStorage.getItem('BatchStartDate');
        return data.value >= new Date(startDate);
    }

    getResortData(){
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
    }

    updateScheduleTraining(){
        
        this.batchVar.batchFrom = new Date(this.scheduleData.assignedDate);
        this.batchVar.batchTo = new Date(this.scheduleData.dueDate);
        this.batchVar.batchName = this.scheduleData.name;
        this.batchVar.selectedResort = this.scheduleData.Resorts.length && this.scheduleData.Resorts[0].resortId;
        this.batchVar.moduleForm = this.scheduleData.Courses.map(item=>{
            let obj = {
                'courseId': item.courseId,
                'courseName': item.Course.courseName,
                'passPercentage': item.passPercentage,
                'mandatory' : item.isMandatory ? "true" : "false",
                'trainingScheduleCourseId' : item.trainingScheduleCourseId
                // 'optional' : item.isOptional
               }
               this.courseIds.push(item.courseId);
               return obj;
               
        });

        this.reminder=this.scheduleData.notificationDays;
        this.employeesInBatch = this.scheduleData.Resorts.map(item=>{
            let obj = {
                userId : item.userId,
                divisionId : item.divisionId,
                departmentId : item.departmentId
            }
            // Set dropdown data
            if(this.batchVar.selectedDivision.length){this.batchVar.selectedDivision.forEach(x=>{
                if(x.divisionId != item.divisionId){
                    this.batchVar.selectedDivision.push(item.Division);
                    this.onEmpSelect('','div');
                }
            }) }else{ this.batchVar.selectedDivision.push(item.Division) ;this.onEmpSelect('','div');}

            if(this.batchVar.selectedDepartment.length) { this.batchVar.selectedDepartment.forEach(x=>{
                if(x.departmentId != item.departmentId){
                    this.batchVar.selectedDepartment.push(item.Department);
                    this.onEmpSelect('','dept');
                }
            }) }else{ this.batchVar.selectedDepartment.push(item.Department);this.onEmpSelect('','dept');}

            if(this.batchVar.selectedEmp.length){ 
                this.batchVar.selectedEmp.push(item.User);
                let index;
                let valueArr = this.batchVar.selectedEmp.map(function(item){ return parseInt(item.userId) });
                let isDuplicate = valueArr.some(function(item, idx){
                    if(valueArr.indexOf(item) != idx){
                        index = idx;
                    } 
                    return valueArr.indexOf(item) != idx 
                });
                isDuplicate && this.batchVar.selectedEmp.splice(index,1);
            
            }else{
                this.batchVar.selectedEmp.push(item.User);
            }
            return obj;
        })
    }

    courseUpdate(data,i){
        
        let valueArr = this.batchVar.moduleForm.map(function(item){ return parseInt(item.courseId) });
        let isDuplicate = valueArr.some(function(item, idx){ 
            return valueArr.indexOf(item) != idx 
        });
        
        if(isDuplicate){
            this.batchVar.moduleForm[i] = {
                'courseId': "",
                'courseName': "",
                'passPercentage':"null",
                'mandatory' :"true",
                'duplicateCourse' : true
            };
            this.alertService.error(this.commonLabels.mandatoryLabels.courseScheduleError)
        }
        else{
            this.batchVar.moduleForm.forEach(item=>{
                if(item.duplicateCourse){
                    delete item.duplicateCourse;
                }
            })
            this.courseIds.push(parseInt(data))
            this.courseDataList.forEach(x=>{
                if(x.courseId===parseInt(data)){
                    this.batchVar.moduleForm[i].courseName = x.courseName;
                }
            })
                
        }
        
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
        this.batchVar.employeeId = this.batchVar.selectedEmp.map(item => { return item.userId });
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
        

        if(event.userId){
            const newArray = this.employeesInBatch.filter(item => item.userId != event.userId);
            
            this.employeesInBatch = newArray;

        }
       
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
        this.passPerError = false;
        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        this.batchVar.dategreater = Date.parse(this.batchVar.batchFrom) > Date.parse(this.batchVar.batchTo) ? true : false;
        this.status = ( this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd') == this.datePipe.transform(new Date(), 'yyyy-MM-dd') ) ? 'assigned' : 'unassigned';
        this.batchVar.moduleForm.forEach(item=>{
            if(item.passPercentage === 'null'){
                this.passPerError = true;
            }
        })
        if (this.batchVar.batchFrom && this.batchVar.batchTo && this.batchVar.batchName && this.employeesInBatch.length && this.batchVar.moduleForm && this.durationValue && this.reminder && !this.passPerError) {
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
            if(this.scheduleId){
                delete postData.status;
                this.courseService.updateScheduleTraining(this.scheduleId,postData).subscribe(resp=>{
                    this.hidePopup('submit');
                },err =>{
                    // this.errorValidation = false;
                    this.errorValidate = 'Training schedule name must be unique';
                    this.alertService.error(err.error.error);
                });
            }
            else{
                this.courseService.scheduleTraining(postData).subscribe(result=>{
                    if(result.isSuccess){ 
                            //   this.clearBatchForm();
                            this.hidePopup('submit');
                            this.alertService.success(result.message);                        
                    }else{
                        this.errStatus= true;
                        this.errMsg= result.error;
                    }
                },err =>{
                    // this.errorValidation = false;
                    this.errorValidate = 'Training schedule name must be unique';
                    this.alertService.error(err.error.error);
                });
            }    
        }
    }

    hidePopup(data){
        this.clearBatchForm();
        
        this.someEvent.next(data);
    }

    clearBatchForm() {
        this.batchVar.moduleForm = [{
            'courseId': "",
            'courseName': "",
            'passPercentage':"null",
            'mandatory' :"true"
        }];
        this.clearBatchVar();
    }

    clearBatchVar(){
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
            'courseId': "",
            'courseName': "",
            'passPercentage':"null",
            'mandatory' :"true"
        };
        this.batchVar.moduleForm.push(obj);
    }
    



}
