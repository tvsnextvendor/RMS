import { Component, OnInit,TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { VideosTrendVar } from '../../Constants/videostrend.var';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExcelService, PDFService, AlertService, CommonService, UtilService,BreadCrumbService,ResortService,UserService } from '../../services';
import { API_URL } from 'src/app/Constants/api_url';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-videostrend-details',
    templateUrl: './videostrend-details.component.html',
    styleUrls: ['./videostrend-details.component.css'],
})

export class VideosTrendDetailsComponent implements OnInit {
    resortId;
    CourseTrendList;
    resortList = [];
    divisionList = [];
    departmentList = [];
    empList = [];
    filterResort = null;
    filterDivision = null;
    filterDept = null;
    filterUser = null;
    roleId;
    enableFilter= false;
    trendType;
    modalRef;
    modalConfig;
    batchFrom;
    batchTo;
    currentDate;
    rescheduleError = false;
    scheduleId;
    selectedUserId;
     // added employee div Drop Down
    divIds;
    allDivisions;
    setDivIds;
    allResorts;
    deptIds;
    allDepartments;
    setDeptIds;


    constructor(private headerService: HeaderService,
        private excelService: ExcelService,
        private pdfService: PDFService,
        private activatedRoute: ActivatedRoute,
        public trendsVar: VideosTrendVar,
        private utilService: UtilService,
        public commonLabels:CommonLabels,
        private commonService: CommonService,
        private breadCrumbService :BreadCrumbService,
        private resortService : ResortService,
        private userService :UserService,
        public location : Location,
        private alertService : AlertService,
        private modalService: BsModalService,
        private datePipe: DatePipe) {
        this.resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        this.activatedRoute.params.subscribe((params: Params) => {
            this.trendsVar.videoId = params['id'];
        });
        this.trendsVar.url = API_URL.URLS;
        this.activatedRoute.queryParams.subscribe((params) => {
            this.trendType = params.type;
          });
          // added employee div Drop Down
          this.divIds =this.utilService.getDivisions() ? this.utilService.getDivisions() :'';
          this.deptIds =this.utilService.getDepartment() ? this.utilService.getDepartment() :'';
         
    }

    ngOnInit() {
        this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
        this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
        let title = this.trendType == 'course' ? this.commonLabels.titles.courseTrend : (this.trendType == 'class' ? this.commonLabels.labels.classTrend : this.commonLabels.labels.notificationTrend);
        this.headerService.setTitle({ title: title, hidemodule: false });
        this.breadCrumbService.setTitle([]);
        this.currentDate = new Date();
        this.roleId = this.utilService.getRole();
        this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
        let filterSite = localStorage.getItem('filterSite') ? localStorage.getItem('filterSite') : ''
        this.filterResort = filterSite ? filterSite : (this.resortId ? this.resortId : null);
        this.getEmployeeList('');
        this.getResortList();
    }

    getEmployeeList(filter){
        let query =  this.resortId  ? '&resortId='+this.resortId : '';
        if(filter){
            query = query+filter
        }else{
             // added employee div Drop Down
            query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
            query+= (this.setDeptIds && this.roleId == 4)?'&departmentIds='+this.setDeptIds:'';
        }
        if(this.roleId == 4){
            let user = this.utilService.getUserData();
            query = query+'&createdBy='+user.userId;
        }
        this.commonService.getCourseEmployeeList(query, this.trendsVar.videoId,this.trendType).subscribe((result) => {
            if  (result && result.isSuccess) {
                this.trendsVar.employeeList = result.data.rows ? result.data.rows : [];
            }
        },err=>{
            this.trendsVar.employeeList = [];
            this.alertService.error(err.error.error);
        });
    }


    getResortList(){
        if(this.roleId != 1){
            // this.resortService.getResort().subscribe(item=>{
            //     if(item && item.isSuccess){
            //         this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
            //         this.filterSelect(this.filterResort,'resort')
            //     } 
            // })
            this.commonService.getResortForFeedback(this.resortId).subscribe(item=>{
                if(item && item.isSuccess){
                    this.allResorts = item.data && item.data.rows.length ? item.data.rows : [];
                    if (this.roleId === 4) {
                        this.resortList = [];
                        let empResort = this.allResorts.map(x => {
                            if (x.resortId === this.resortId) {
                                this.resortList.push(x);
                            }
                        });
                    } else {
                        this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                    }
                    this.filterSelect('','resort')
                } 
            })
        }
        else{
            this.commonService.getAllResort('').subscribe(item=>{
                if(item && item.isSuccess){
                    this.resortList = item.data && item.data.length ? item.data : [];
                    // this.filterSelect(this.filterResort,'resort')
                } 
            })
        }
    }


    filterSelect(value,type){
        this.resortId = '';
        let resortid = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
        if(type == "resort"){
            this.filterDivision =null;
            this.filterDept = null;
            this.filterUser = null;
            let filterResort; 
            if(this.filterResort && this.filterResort != 'null') {
                filterResort = this.filterResort;
                this.resortService.getResortByParentId(filterResort).subscribe((result) => {
                    if (result.isSuccess) {
                        this.allDivisions = result.data.divisions;
                        if(this.divIds.length > 0 && this.roleId === 4){
                            this.divisionList = [];
                            this.allDivisions.filter(g => this.divIds.includes(g.divisionId)).map(g =>{
                                this.divisionList.push(g);
                            });
                        }else{
                            this.divisionList = result.data.divisions;
                        }
                    }
                })
            }  else{
                filterResort = resortid;
                this.divisionList = [];
                this.departmentList = [];
                this.empList = [];
            } 
            let query = "&resortId="+filterResort;
            if(value){
                this.getEmployeeList(query);
            } 

        }
        else if(type == "division"){
            this.filterDept = null;
            this.filterUser = null;
            // console.log(value);
            this.filterDivision = this.filterDivision && this.filterDivision != 'null' ? this.filterDivision : null;
            let filterDivision = this.filterDivision ? this.filterDivision : '';
            if(this.filterDivision){
                let obj = { 'divisionId': this.filterDivision };
                this.commonService.getDepartmentList(obj).subscribe((result) => {
                    if (result.isSuccess) {
                        // this.departmentList = result.data.rows;
                        this.allDepartments = result.data.rows;
                        if(this.deptIds.length > 0 && this.roleId === 4){
                            this.departmentList = [];
                            this.allDepartments.filter(g => this.deptIds.includes(g.departmentId)).map(g =>{
                                this.departmentList.push(g);
                            });
                        }else{
                            this.departmentList = result.data.rows;
                        }
                    }
                })
            }
            else{
                this.departmentList = [];
                this.empList = [];
            }
            let query = "&resortId="+this.filterResort+"&divisionId="+filterDivision;
            this.getEmployeeList(query);
        }
        else if(type == "dept"){
            this.filterUser = null;
            
            this.filterDept = this.filterDept && this.filterDept != 'null' ? this.filterDept : null;
            let filterDept = this.filterDept ? this.filterDept : '';
            if(this.filterDept){
                let data = { 'departmentId': filterDept, 'createdBy': ' ' };
                this.roleId != 1 ? data.createdBy =  this.utilService.getUserData().userId : delete data.createdBy;
                this.userService.getUserByDivDept(data).subscribe(result => {
                    if (result && result.data) {
                        this.empList = result.data;
                        // let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
                        // this.getEmployeeList(query);
                    }
    
                })
            }
            else{
                this.empList = [];
            }
        
            let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+filterDept;
            this.getEmployeeList(query);
        }
        else if(type == "emp"){
            // console.log(value);
            this.filterUser = this.filterUser && this.filterUser != 'null' ? this.filterUser : null;
            let filterUser = this.filterUser ? this.filterUser : '';
            let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+filterUser;
            this.getEmployeeList(query);
        }

    }

    resetFilter(){
        // this.filterResort = null;
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
        this.filterResort = this.resortId;
        this.getEmployeeList('');
    }

    openSchedulePopup(template: TemplateRef<any>,data){
        console.log(data)
        this.batchFrom = data.TrainingSchedule && data.TrainingSchedule.assignedDate ? new Date(data.TrainingSchedule.assignedDate) : new Date(); 
        this.scheduleId = data.trainingScheduleId  ? data.trainingScheduleId : '';
        this.selectedUserId = data.userId;
        if(this.scheduleId){
            this.modalRef = this.modalService.show(template, this.modalConfig);
        }  
    }
    closePopup(){
        this.batchFrom = '';
        this.batchTo = '';
        this.scheduleId = '';
        this.modalRef.hide();
    }
    rescheduleSubmit(){
        if(this.batchFrom && this.batchTo){
            this.rescheduleError = false;
            let params = {
                assignedDate : this.datePipe.transform(this.batchFrom, 'yyyy-MM-dd'),
                dueDate : this.datePipe.transform(this.batchTo, 'yyyy-MM-dd'),
                trainingScheduleId : this.scheduleId,
                userId : this.selectedUserId,
                resortId    : this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '',
                courseId : '',
                trainingClassId : '',
                notificationFileId  : ''
            }
            if(this.trendType == 'course'){
                params.courseId = this.trendsVar.videoId;
                delete params.trainingClassId;
                delete params.notificationFileId; 
            }
            else if(this.trendType == 'class'){
                params.trainingClassId = this.trendsVar.videoId;
                delete params.courseId;
                delete params.notificationFileId; 
            }
            else{
                params.notificationFileId = this.trendsVar.videoId;
                delete params.courseId;
                delete params.trainingClassId; 
            }

            this.userService.rescheduleFile(this.scheduleId,params).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.closePopup();
                    this.getEmployeeList('');
                }
            },err=>{
                this.closePopup();
                this.alertService.error(err.error.error);
            })
        }
        else{
            this.rescheduleError = true;
        }
    }
     // Create Excel sheet
   exportAsXLSX():void {
       let data = this.trendsVar.employeeList.map(item=>{
           let obj = {
                "Employee Name" : item.User.userName ,
                "Site Name"     : item.Resort.resortName,
                "Status"        :   item.status,
                "Time taken"    :   item.timeTaken ?  item.timeTaken : '',
                "Assigned Date" :   item.TrainingSchedule.assignedDate,
                "Completed Date"    : item.completedDate ? item.completedDate : ''
           }
           return obj
       })
       let title = (this.trendType == 'course' ? (this.commonLabels.titles.courseTrend+"-"+this.trendsVar.employeeList[0].Course.courseName) : (this.trendType == 'class' ? (this.commonLabels.labels.classTrend+"-"+this.trendsVar.employeeList[0].TrainingClass.trainingClassName) : (this.commonLabels.labels.notificationTrend+"-"+this.trendsVar.employeeList[0].TrainingSchedule.name)));
        this.excelService.exportAsExcelFile(data,title);
  }
}
