import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { HeaderService,UtilService,ResortService ,CourseService,CommonService,UserService} from '../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BatchVar } from '../../Constants/batch.var';
import { ModuleVar } from '../../Constants/module.var';
import { HttpService } from 'src/app/services/http.service';
import { API_URL } from '../../Constants/api_url';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import * as moment from 'moment';
import{ CommonLabels }  from '../../Constants/common-labels.var'

@Component({
    selector: 'app-add-notification',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.css']
})

export class AddNotificationComponent implements OnInit {
    @Output() someEvent = new EventEmitter<string>();
    @Input() notificationType;
    durationValue = '1';
    reminder;
    showToDate = false;
    showFromDate = false;
    dateError = false;
    labels;
    file;
    fileName;
    description;
    moduleSubmitted;
    uploadFileName;
    notificationFileName;
    constructor(private alertService: AlertService, private headerService: HeaderService,public moduleVar: ModuleVar, private datePipe: DatePipe, private activatedRoute: ActivatedRoute, private http: HttpService, public batchVar: BatchVar, private toastr: ToastrService, private router: Router,
        public commonLabels:CommonLabels , private utilService : UtilService,private resortService : ResortService,private courseService : CourseService,private commonService : CommonService,private userService : UserService) {
        this.batchVar.url = API_URL.URLS;
        this.labels = moduleVar.labels;
    }

    ngOnInit() {
        let startDate = localStorage.getItem('BatchStartDate');
        this.batchVar.batchFrom = new Date(startDate);
        this.batchVar.batchTo = '';
        this.getDropdownDetails();
    }

    getDropdownDetails(){
        const resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId; 
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            this.moduleVar.resortList=result.data.Resort;
            this.moduleVar.divisionList=result.data.divisions;

        })
        this.courseService.getAllCourse().subscribe(result=>{
            if(result && result.isSuccess){
              this.moduleVar.courseList = result.data && result.data.rows;
            }
          })
    }

    selectFilter(data) {
        let startDate = localStorage.getItem('BatchStartDate');
        return data.value >= new Date(startDate);
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

    onItemSelect(event,key,checkType){
        if (event.divisionId) {
            this.moduleVar.divisionId = event.divisionId;
          } else if (event.departmentId) {
            this.moduleVar.departmentId = event.departmentId;
          } else {
            this.moduleVar.divisionId = '';
            this.moduleVar.departmentId = '';
          }
          
          if (key == 'division') {
            const obj = { 'divisionId': this.moduleVar.divisionId };
            this.commonService.getDepartmentList(obj).subscribe((result) => {
              if (result.isSuccess) {
                let listData =_.cloneDeep(this.moduleVar.departmentList);
                this.moduleVar.departmentList = [];
                if(checkType == 'select'){
                  listData && listData.length ? 
                  result.data.rows.forEach(item=>{listData.push(item)}) : 
                  listData = result.data.rows;
                  // this.constant.departmentList = listData.map(item=>{return item});
                }
                else{
                  result.data.rows.length && 
                    result.data.rows.forEach(resp=>{
                      listData.forEach((item,i)=>{
                        if(resp.departmentId == item.departmentId){
                          listData.splice(i,1)
                        }
                      }) 
                    })
                    this.moduleVar.selectedDepartment = [];
                    this.moduleVar.selectedEmployee = [];
                }
                this.moduleVar.departmentList = listData.map(item=>{return item});
              }
            })
          }
          if (key == 'dept') {
            const data = { 'departmentId': this.moduleVar.departmentId, 'createdBy': this.utilService.getUserData().userId }
            this.userService.getUserByDivDept(data).subscribe(result => {
              if (result && result.data) {
                // this.constant.employeeList && this.constant.employeeList.length ? result.data.forEach(item=>{this.constant.employeeList.push(item)}) : 
                // this.constant.employeeList = result.data;
      
                let listData =_.cloneDeep(this.moduleVar.employeeList);
                this.moduleVar.employeeList = [];
                if(checkType == 'select'){
                  listData && listData.length ? 
                  result.data.forEach(item=>{listData.push(item)}) : 
                  listData = result.data;
                }
                else{
                  result.data.length && 
                  result.data.forEach(resp=>{
                    listData.forEach((item,i)=>{
                      if(resp.userId == item.userId){
                        listData.splice(i,1)
                      }
                    }) 
                  })
                  this.moduleVar.selectedEmployee = [];
                }
              
                this.moduleVar.employeeList = listData.map(item=>{return item});
      
                // this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
              }
            })
          }
          if(this.moduleVar.selectedDivision.length && this.moduleVar.selectedDepartment.length && this.moduleVar.selectedEmployee.length ){
            this.moduleVar.errorValidate = false
          }
    }

    onItemDeselect(event,key){

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

        this.batchVar.empValidate = this.batchVar.employeeId ? false : true;
        let data = {}
        console.log(
            this.file,
            this.fileName,
            this.description,
            this.batchVar.batchFrom,
            this.batchVar.batchTo)
            //this.hidePopup();
    }

    hidePopup(){
        this.clearBatchForm();
        this.someEvent.next();
    }

    clearBatchForm() {
        // this.batchVar.moduleForm = [{
        //     moduleId: 1,
        //     program: "null",
        //     passpercentage: "null",
        //     mandatory: "true",
        // }];
        this.batchVar.batchFrom = '';
        this.batchVar.batchTo = '';
        this.batchVar.selectedEmp = [];
        this.batchVar.batchName = '';
        this.moduleVar.selectedCourses = null;
        this.moduleVar.selectedTrainingClass = null;
        this.moduleVar.trainingClassList = [];
        // this.router.navigateByUrl('/calendar');
    }

    courseSelect(event){
        if(event.target.value){
            let courseId = event.target.value;
            this.courseService.getTrainingclassesById(courseId).subscribe(result=>{
                if(result && result.isSuccess){
                  this.moduleVar.trainingClassList = result.data && result.data.length && result.data;
                }
            })
        }
    }

    //dynamic add module fields 
    addForm() {
        // let obj = {
        //     moduleId: 1,
        //     program: "null",
        //     passpercentage: "null",
        //     mandatory: "true",
        // };
        // this.batchVar.moduleForm.push(obj);
    }

    //dynamic remove module fields
    removeForm(i) {
     //   this.batchVar.moduleForm.splice(i, 1);
    }

    getFileDetails(event){
        if(event.target.files){
            this.uploadFileName = event.target.files[0] && event.target.files[0].name;
            let file = event.target.files[0];
            console.log(file)
            this.commonService.uploadFiles(file).subscribe(resp=>{
                console.log(resp);
                if(resp && resp.isSuccess){
                    this.notificationFileName = resp.data.length && resp.data[0].filename;
                }
            })
        }
         
    }

}
