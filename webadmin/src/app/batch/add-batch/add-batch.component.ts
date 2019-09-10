import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BatchVar } from '../../Constants/batch.var';
import { API_URL } from '../../Constants/api_url';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonService, AlertService, HttpService, UtilService, HeaderService, UserService, CourseService, ResortService, BreadCrumbService } from '../../services';
import * as moment from 'moment';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-add-batch',
    templateUrl: './add-batch.component.html',
    styleUrls: ['./add-batch.component.css']
})

export class AddBatchComponent implements OnInit {
    @Output() someEvent = new EventEmitter<string>();
    @Output() completed = new EventEmitter<string>();
    @Input() courseList: any = [];
    @Input() scheduleId;
    @Input() scheduleData;
    @Input() networkResortId;
    @Input() tabType;
    courseIds = [];
    durationValue = '3';
    maxdurationCount;
    countCheck = false;
    countError;
    reminder;
    status = '';
    errStatus = false;
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
    courseError;
    errorValidate;
    resortId;
    roleId;
    paramsType;
    currentDate;
    previousUpdate = false;
    existingUser = [];
    trainingClassData;
    getCourseId = [];
    existCourses = [];

    constructor(private breadCrumbService: BreadCrumbService, private alertService: AlertService, private courseService: CourseService, private utilService: UtilService, private resortService: ResortService, private userService: UserService, private headerService: HeaderService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router, private commonService: CommonService, public commonLabels: CommonLabels) {
        this.batchVar.url = API_URL.URLS;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.batchVar.batchId = params['batchId'];
        });
        this.activatedRoute.queryParams.subscribe(items => {
            this.paramsType = items.type;
        })
        this.roleId = this.utilService.getRole();
    }
    
    ngOnInit() {
        //   this.scheduleId ? this.headerService.setTitle({ title: this.commonLabels.titles.editTitle, hidemodule: false }) : this.headerService.setTitle({ title: this.commonLabels.titles.addTitle, hidemodule: false });
        this.batchVar.moduleForm = [];
        this.clearBatchVar();
        this.batchVar.dategreater = false;
        // let data = this.scheduleId ? [{ title: this.commonLabels.labels.calendarView, url: '/calendar' }, { title: this.commonLabels.btns.scheduleTraining, url: '' }] : [{ title: this.commonLabels.labels.resourceLibrary, url: '/cms-library' }, { title: this.commonLabels.btns.scheduleTraining, url: '' }]
        let data = [{ title: this.commonLabels.labels.calendarView, url: '/calendar' }, { title: this.commonLabels.btns.scheduleTraining, url: '' }];
        this.breadCrumbService.setTitle(data)
        this.userData = this.utilService.getUserData();
        this.currentDate = new Date();
        if (this.scheduleId) {
            this.clearBatchForm();
            this.getCourseData();
        }
        else {
            this.resortId = this.userData.ResortUserMappings.length ? this.userData.ResortUserMappings[0].Resort.resortId : '';
            if(this.roleId == 1){
                this.getResortList();
            }
            else{
                this.getResortData(this.resortId);  
            }
           
            let startDate = localStorage.getItem('BatchStartDate');
            this.batchVar.batchFrom = new Date(startDate);
            this.courseForm();
        }
    }

    getCourseData() {
        this.resortId = this.userData.ResortUserMappings.length ? this.userData.ResortUserMappings[0].Resort.resortId : ''; 
        let query = this.resortId ? '?resortId='+this.resortId : ''; 
        this.courseService.getCourseForNotification(query).subscribe(resp => {
            if (resp && resp.isSuccess) {
                this.courseDataList = resp.data.length ? resp.data.map(item => {
                    let obj = {
                        courseId: item.courseId,
                        courseName: item.courseName
                    }
                    return obj;
                }) : [];
                if(this.roleId == 1){
                    this.getResortList();
                }
                else{
                    this.getResortData(this.resortId);  
                }
            }
        });
        let currentquery = '?resortId='+this.resortId;
        this.courseService.getDropTrainingClassList(currentquery).subscribe(result => {
            if (result && result.isSuccess) {
            this.trainingClassData = result.data.rows.length ? result.data.rows : [];
            }
        });
    }
    // getResort

    getResortList(){
        this.resortService.getResort().subscribe(item=>{
            console.log(item)
            if(item && item.isSuccess){
                this.batchVar.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                if (this.scheduleId) {
                    this.getResortData(this.networkResortId);
                }
            }
            
        })
    }
    selectFilter(data) {
        let startDate = localStorage.getItem('BatchStartDate');
        return data.value >= new Date(startDate);
    }

    getResortData(resortId) {
        this.batchVar.departmentList = [];
        this.batchVar.divisionList = [];
        this.batchVar.employeeList = [];
        this.batchVar.selectedDivision = [];
        this.batchVar.selectedDepartment = [];
        this.batchVar.selectedEmp = []; 
        this.resortService.getResortByParentId(resortId).subscribe((result) => {
            (this.resortId == parseInt(resortId)) ? this.batchVar.resortList = result.data.Resort : '';
            this.batchVar.divisionList = result.data.divisions;
            this.batchVar.selectedResort = resortId;
            if (this.scheduleId) {
                this.updateScheduleTraining();
            }
        })

        //get percentage list
        this.http.get(this.batchVar.url.getPercentageList).subscribe((data) => {
            this.batchVar.percentageList = data.passPercentage;
        });
    }

    updateScheduleTraining() {
        this.batchVar.batchFrom = new Date(this.scheduleData.assignedDate);
        if(this.batchVar.batchFrom < this.currentDate){
            this.previousUpdate = true;
        }
        this.tabType = this.scheduleData.scheduleType == 'trainingClass' ? 'training' : this.scheduleData.scheduleType;
        this.batchVar.batchTo = new Date(this.scheduleData.dueDate);
        this.batchVar.batchName = this.scheduleData.name;
        this.batchVar.selectedResort = this.scheduleData.Resorts.length && this.scheduleData.Resorts[0].resortId;
        let courseDetails = this.scheduleData.Courses.map(item => {
            let obj = {};

            if(this.tabType == 'course'){
                obj = {
                    'courseId': item.courseId ? item.courseId :  '',
                    'courseName': item.Course ? item.Course.courseName : '',
                    'passPercentage': item.passPercentage,
                    'mandatory': item.isMandatory ? "true" : "false",
                    'trainingScheduleCourseId': item.trainingScheduleCourseId
                    // 'optional' : item.isOptional
                }
                this.courseIds.push(item.courseId);
                this.getCourseId.push(item.courseId);
            }
            else if(this.tabType == 'training'){
                obj = {
                    'trainingClassId': (item.trainingClassId ? item.trainingClassId : ''),
                    'trainingClassName':  (item.TrainingClass ? item.TrainingClass.trainingClassName : ''),
                    'passPercentage': item.passPercentage,
                    'mandatory': item.isMandatory ? "true" : "false",
                    'trainingScheduleCourseId': item.trainingScheduleCourseId
                    // 'optional' : item.isOptional
                }
                this.courseIds.push(item.trainingClassId);
                this.getCourseId.push(item.trainingClassId)
            }
            return obj;
        })
        this.existCourses = _.cloneDeep(courseDetails);
        this.batchVar.moduleForm = courseDetails
        this.reminder = this.scheduleData.notificationDays;
        let resort = _.uniqBy(this.scheduleData.Resorts, 'userId');
        let div = _.cloneDeep(this.batchVar.divisionList)
        this.batchVar.divisionId = resort[0].divisionId;
        this.batchVar.selectedDepartment = resort[0].departmentId;
        this.getDropDownValues('', 'div');
        this.batchVar.departmentId = resort[0].departmentId;
        this.getDropDownValues('', 'dept');
        this.batchVar.employeeId = resort.map(item => { return item.userId });
        this.batchVar.selectedEmp = resort.map(item => { return item.User });
        this.batchVar.selectedDivision = div.filter(item => this.batchVar.divisionId.some(other => item.divisionId === other));
        this.existingUser = resort.map(item => { return item.userId });
        // this.scheduleData.Resorts.forEach(item=>{
        // let obj = {
        //     userId : item.userId,
        //     divisionId : item.divisionId,
        //     departmentId : item.departmentId
        // }
        // // Set dropdown data
        // if(this.batchVar.selectedDivision.length){this.batchVar.selectedDivision.forEach(x=>{
        //     if(x.divisionId != item.divisionId){
        //         this.batchVar.selectedDivision.push(item.Division);
        //         // this.onEmpSelect('','div');
        //     }
        // }) }else if(item.Division){ 
        //     this.batchVar.selectedDivision.push(item.Division) ;
        //     // this.onEmpSelect('','div');
        // }

        // if(this.batchVar.selectedDepartment.length) { this.batchVar.selectedDepartment.forEach(x=>{
        //     if(x.departmentId != item.departmentId){
        //         this.batchVar.selectedDepartment.push(item.Department);
        //         // this.onEmpSelect('','dept');
        //     }
        // }) }else if(item.Department){ 
        //     this.batchVar.selectedDepartment.push(item.Department);
        //     // this.onEmpSelect('','dept');
        // }

        // if(this.batchVar.selectedEmp.length){ 
        //     this.batchVar.selectedEmp.push(item.User);
        //     let index;
        //     let valueArr = this.batchVar.selectedEmp.map(function(item){ return parseInt(item.userId) });
        //     let isDuplicate = valueArr.some(function(item, idx){
        //         if(valueArr.indexOf(item) != idx){
        //             index = idx;
        //         } 
        //         return valueArr.indexOf(item) != idx 
        //     });
        //     isDuplicate && this.batchVar.selectedEmp.splice(index,1);

        // }else if(item.User){
        //     this.batchVar.selectedEmp.push(item.User);
        // }
        // return obj;
        // })
    }

    courseUpdate(data, i) {
        if(this.tabType == 'course'){
            let valueArr = this.batchVar.moduleForm.map(function (item) { return parseInt(item.courseId) });
            let isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx
            });

            if (isDuplicate) {
                this.batchVar.moduleForm[i] = {
                    'courseId': "",
                    'courseName': "",
                    'passPercentage': "100",
                    'mandatory': "true",
                    'duplicateCourse': true
                };
                this.alertService.error(this.commonLabels.mandatoryLabels.courseScheduleError)
            }
            else {
                this.batchVar.moduleForm.forEach(item => {
                    if (item.duplicateCourse) {
                        delete item.duplicateCourse;
                    }
                })
                this.courseIds.push(parseInt(data))
                this.courseDataList.forEach(x => {
                    if (x.courseId === parseInt(data)) {
                        this.batchVar.moduleForm[i].courseName = x.courseName;
                    }
                })
            }
        }
        else  if(this.tabType == 'training'){
            let valueArr = this.batchVar.moduleForm.map(function (item) { return parseInt(item.trainingClassId) });
            let isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx
            });

            if (isDuplicate) {
                this.batchVar.moduleForm[i] = {
                    'trainingClassId': "",
                    'trainingClassName': "",
                    'passPercentage': "100",
                    'mandatory': "true",
                    'duplicateCourse': true
                };
                this.alertService.error(this.commonLabels.mandatoryLabels.classScheduleError)
            }
            else {
                this.batchVar.moduleForm.forEach(item => {
                    if (item.duplicateCourse) {
                        delete item.duplicateCourse;
                    }
                })
                this.courseIds.push(parseInt(data))
                this.trainingClassData.forEach(x => {
                    if (x.trainingClassId === parseInt(data)) {
                        this.batchVar.moduleForm[i].trainingClassName = x.trainingClassName;
                    }
                })
            }
        }
    }

    courseForm() {
        console.log(this.tabType)
        if(this.tabType == "course"){
            this.courseIds = this.courseList.map(a => a.courseId);
            this.courseList.forEach((item, key) => {
                let obj = {
                    'courseId': item.courseId,
                    'courseName': item.courseName,
                    'passPercentage': "100",
                    'mandatory': "true"
                }
                this.batchVar.moduleForm.push(obj);
            });
        }
        else if(this.tabType == "training"){
            this.courseIds = this.courseList.map(a => a.trainingClassId);
            this.courseList.forEach((item, key) => {
                let obj = {
                    'trainingClassId': item.trainingClassId,
                    'trainingClassName': item.trainingClassName,
                    'passPercentage': "100",
                    'mandatory': "true"
                }
                this.batchVar.moduleForm.push(obj);
            });
        }
        else if(this.tabType == "notification"){
            this.courseIds = this.courseList.map(a => a.notificationFileId);
            this.courseList.forEach((item, key) => {
                let obj = {
                    'notificationFileId': item.notificationFileId,
                    'fileName': item.fileName,
                    'passPercentage': "100",
                    'mandatory': "true"
                }
                this.batchVar.moduleForm.push(obj);
            }); 
        }
       
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


    onEmpAllSelect(event, key) {
        if (key == 'div') {
            this.batchVar.selectedDivision = event;
            this.onEmpSelect('', 'div');
            if (!event.length) {
                this.batchVar.departmentList = [];
                this.batchVar.employeeList = [];
            }
        }
        if (key == 'dept') {
            this.batchVar.selectedDepartment = event;
            this.onEmpSelect('', 'dept');
            if (!event.length) {
                this.batchVar.employeeList = [];
            }
        }
        if (key == 'emp') {
            this.batchVar.selectedEmp = event;
            this.onEmpSelect(event, 'emp')
        }
    }

    onEmpSelect(event, key) {
        this.batchVar.employeeId = this.batchVar.selectedEmp.map(item => { return item.userId });
        this.batchVar.departmentId = this.batchVar.selectedDepartment.map(item => { return item.departmentId });
        this.batchVar.divisionId = this.batchVar.selectedDivision.length ? this.batchVar.selectedDivision.map(item => { return item.divisionId }) : [];
        this.getDropDownValues(event, key);
        this.batchVar.empValidate = false;
    }

    getDropDownValues(event, key) {
        if (key == 'div') {
            const obj = { 'divisionId': this.batchVar.divisionId };
            this.commonService.getDepartmentList(obj).subscribe((result) => {
                if (result.isSuccess) {
                    this.batchVar.departmentList = result.data.rows;
                    if (this.scheduleId) {
                        let dept = _.cloneDeep(this.batchVar.departmentList);
                        this.batchVar.selectedDepartment =  result.data.rows.filter(x => this.batchVar.selectedDepartment.find(o => x.departmentId === o));
                    }
                }
                else{
                    this.batchVar.departmentId = [];
                    this.batchVar.departmentList  = [];
                    this.batchVar.selectedDepartment = [];
                    this.batchVar.selectedEmp = []; 
                    this.batchVar.employeeList = [];
                }
            })
        }

        if (key == 'dept') {
            // this.batchVar.selectedEmp = []; 
            this.batchVar.employeeList = [];
            const data = { 'departmentId': this.batchVar.departmentId, 'resortId': ' ',type : 'schedule' };
            this.roleId != 1 ? data.resortId =  this.batchVar.selectedResort : delete data.resortId;
            this.userService.getUserByDivDept(data).subscribe(result => {
                if (result && result.data) {
                    this.batchVar.employeeList = result.data;
                    this.batchVar.selectedEmp = this.batchVar.selectedEmp.filter(o => result.data.find(x => x.userId === o.userId));
                    // this.batchVar.selectedEmp = this.batchVar.selectedEmp.filter(item=>)
                    this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
                }
                else{
                     this.batchVar.selectedEmp = []; 
                    this.batchVar.employeeList = [];
                }

            })
        }

        if (key == 'emp') {
            if (event.userId && this.allEmployees[event.userId]) {
                this.employeesInBatch.push(this.allEmployees[event.userId]);
            }
            else if (event.length) {
                event.forEach(item => {
                    if (item.userId && this.allEmployees[item.userId]) {
                        this.employeesInBatch.push(this.allEmployees[item.userId]);
                    }
                })
            }
        }
    }

    onEmpDeSelect(event) {
        if (event.userId) {
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
        this.errStatus = false;
        this.submitted = true;
        this.passPerError = false;
        this.courseError = false;
        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        this.batchVar.dategreater = Date.parse(this.batchVar.batchFrom) > Date.parse(this.batchVar.batchTo) ? true : false;
       this.status = (this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd') == this.datePipe.transform(new Date(), 'yyyy-MM-dd')) ? 'assigned' : 'unAssigned';
        // this.status = 'assigned';
        this.batchVar.moduleForm.forEach(item => {
            if (item.passPercentage === 'null') {
                this.passPerError = true;
            }
            if(item.courseId == ''){
                this.courseError = true;
            }
        })
        let nullArray = this.batchVar.employeeId.filter(item=>item == null);
        if (this.batchVar.batchFrom && this.batchVar.batchTo && this.batchVar.batchName && this.batchVar.divisionId.length && this.batchVar.departmentId.length && this.batchVar.employeeId.length && this.batchVar.moduleForm && this.durationValue && this.reminder && !this.passPerError && !this.courseError && !nullArray.length && !this.batchVar.dategreater) {
            //  this.batchVar.moduleForm.forEach(function(course){ delete course.courseName });
            let postData = {
                "createdBy": this.userData.userId,
                "assignedDate": this.datePipe.transform(this.batchVar.batchFrom, 'yyyy-MM-dd'),
                "dueDate": this.datePipe.transform(this.batchVar.batchTo, 'yyyy-MM-dd'),
                "name": this.batchVar.batchName,
                "status": this.status,
                "notificationDays": this.reminder,
                "resort": {
                    "resortId": this.batchVar.selectedResort,
                    "courses": this.courseIds,
                    // "users": this.employeesInBatch
                },
                "departmentId": this.batchVar.departmentId,
                "divisionId": this.batchVar.divisionId,
                "userId": this.batchVar.employeeId,
                "courses": this.batchVar.moduleForm,
                "insertUserId" : [],
                "getUserId" : [],
                "getCourseId" : [],
                "scheduleType" : this.tabType == 'training' ? 'trainingClass' : this.tabType,
                "removeCourseOrTCIds" : []
            }
            if(this.tabType == 'training'){
                let getRemoveCourse = _.difference(this.existCourses.map(item=>{return item.trainingClassId}), this.batchVar.moduleForm.map(data=>{ 
                    let id;
                    if(data.trainingScheduleCourseId){
                        id = data.trainingClassId
                    }
                    else{
                        id = null
                    }
                    return id
                }))
                getRemoveCourse.length ? postData.removeCourseOrTCIds = getRemoveCourse : delete  postData.removeCourseOrTCIds;
            }
            else{
                let getRemoveCourse = _.difference(this.existCourses.map(item=>{return item.courseId}), this.batchVar.moduleForm.map(data=>{ 
                    let id;
                    if(data.trainingScheduleCourseId){
                        id = data.courseId
                    }
                    else{
                        id = null
                    }
                    return id
                }))
                getRemoveCourse.length ? postData.removeCourseOrTCIds = getRemoveCourse : delete  postData.removeCourseOrTCIds;
            }
            // console.log(this.existingUser,this.batchVar.selectedEmp)
            if (this.scheduleId) {
                let newUsers = this.batchVar.employeeId.filter(item=> this.existingUser.some(o=> o != item));
                postData.insertUserId = newUsers;
                postData.userId = this.batchVar.selectedEmp.map(item=>{return item.userId});
                postData.getUserId = this.existingUser;
                postData.getCourseId = this.getCourseId;
                this.tabType == "course" ? postData.resort.courses = this.batchVar.moduleForm.map(item=>{return item.courseId}) : 
                postData.resort.courses = this.batchVar.moduleForm.map(item=>{return item.trainingClassId});

                // delete postData.status;
                this.courseService.updateScheduleTraining(this.scheduleId, postData).subscribe(resp => {
                    this.hidePopup('submit');
                }, err => {
                    // this.errorValidation = false;
                    this.errorValidate = err.error.error == 'Training scheduled assigned for the same course & user combination' ? 'Training scheduled assigned for the same course & user combination' : 'Training schedule name must be unique';
                    this.alertService.error(err.error.error);
                });
            }
            else {
                delete postData.insertUserId;
                delete postData.getUserId;
                delete postData.getCourseId;
                this.courseService.scheduleTraining(postData).subscribe(result => {
                    if (result.isSuccess) {
                        //   this.clearBatchForm();
                        this.hidePopup('submit');
                        this.alertService.success(result.message);
                    } else {
                        this.errStatus = true;
                        this.errMsg = result.error;
                    }
                }, err => {
                    // this.errorValidation = false;
                    this.errorValidate = err.error.error == 'Training scheduled assigned for the same course & user combination' ? 'Training scheduled assigned for the same course & user combination' : 'Training schedule name must be unique';
                    this.alertService.error(err.error.error);
                });
            }
        }
        else if(nullArray.length){
            this.alertService.error(this.commonLabels.mandatoryLabels.employeeNullError);
        }
        else if (this.batchVar.batchFrom && this.batchVar.batchTo && this.batchVar.batchName && this.batchVar.divisionId.length && this.batchVar.departmentId.length && this.batchVar.employeeId.length && this.batchVar.moduleForm && this.durationValue && this.reminder && !this.passPerError && !this.courseError && !nullArray.length && this.batchVar.dategreater){
            this.alertService.error(this.commonLabels.mandatoryLabels.dateLimitError)
        }
        else {
            this.alertService.error(this.commonLabels.mandatoryLabels.profileMandatory)
        }
    }

    hidePopup(data) {
        this.clearBatchForm();
        this.goTocmsLibrary();
        // this.someEvent.next(data);
    }

    clearBatchForm() {
        this.batchVar.moduleForm = [{
            'courseId': "",
            'courseName': "",
            'passPercentage': "100",
            'mandatory': "true"
        }];
        this.clearBatchVar();
    }

    clearBatchVar() {
        this.batchVar.batchFrom = '';
        this.batchVar.batchTo = '';
        this.batchVar.batchName = '';
        this.batchVar.selectedEmp = [];
        this.batchVar.selectedResort = null;
        this.batchVar.selectedDivision = [];
        this.batchVar.selectedDepartment = [];
        this.batchVar.employeeList = [];
        this.batchVar.divisionList = [];
        this.batchVar.departmentList = [];
        this.batchVar.divisionId = [];
        this.batchVar.departmentId = [];
        this.batchVar.employeeId = [];
        this.previousUpdate = false;
    }

    //dynamic remove module fields
    removeForm(i) {
        if(this.batchVar.moduleForm.length > 1){
            this.batchVar.moduleForm.splice(i, 1);
        }
        else{
            this.alertService.error(this.commonLabels.mandatoryLabels.scheduleCourse);
        }
    }

    //dynamic add module fields 
    addForm() {

        let obj = {};
        if(this.tabType == 'course'){
            obj = {
                'courseId': "",
                'courseName': "",
                'passPercentage': "100",
                'mandatory': "true"
            };
        }
        else if(this.tabType == 'training'){
            obj = {
                'trainingClassId': "",
                'trainingClassName': "",
                'passPercentage': "100",
                'mandatory': "true"
            };
        }
        else if(this.tabType == 'notification'){
            obj = {
                'notificationFileId': "",
                'fileName': "",
                'passPercentage': "100",
                'mandatory': "true"
            };
        }
        
        this.batchVar.moduleForm.push(obj);
    }

    goTocmsLibrary() {
        this.completed.emit('completed');
    }

    ngOnDestroy(){
        this.previousUpdate = false
    }
}
