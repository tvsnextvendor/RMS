import { Component, OnInit,TemplateRef } from '@angular/core';
import { Location } from '@angular/common'; 
import { ActivatedRoute, Params } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {HeaderService, UtilService, CommonService,BreadCrumbService,ResortService,UserService,AlertService} from '../../services';
import {VideosTrendVar} from '../../Constants/videostrend.var';
import { CommonLabels } from '../../Constants/common-labels.var'
import { query } from '@angular/animations';

@Component({
  selector: 'app-expiretrenddetails',
  templateUrl: './expiretrenddetails.component.html',
  styleUrls: ['./expiretrenddetails.component.css']
})
export class ExpiretrenddetailsComponent implements OnInit {
  courseId;
  roleId;
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
  enableFilter= false;
  selectedEmp = [];
  modalRef;
  modalConfig;
  showReporters = null;
  hideReporters = 'hide';
  trendType ;
  reportingMangerList = [];
  reporter = [];
  reportingError = false;
  comments ; 
  selectAllEmp = false;
  // typeSet1='toAllEmployee';
  // typeSet2='toAllReportManager';

   // added employee div Drop Down
   divIds;
   allDivisions;
   setDivIds;

  reportSettings = {
    singleSelection: false,
    idField: 'userId',
    textField: 'userName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableCheckAll: false,
    itemsShowLimit: 8,
    allowSearchFilter : true,
    searchPlaceholderText : "Search",
    clearSearchFilter : true
}

  constructor(   public trendsVar: VideosTrendVar ,
    private commonService: CommonService,
    private utilService: UtilService,
    public location :Location,
    public commonLabels:CommonLabels,
    private breadCrumbService :BreadCrumbService,
    private headerService : HeaderService,
    private resortService :ResortService,
    private userService : UserService,
    private activatedRoute : ActivatedRoute,
    private modalService: BsModalService,
    private alertService : AlertService) { 
      this.activatedRoute.params.subscribe((params: Params) => {
        this.courseId = params['id'];
      });
      this.activatedRoute.queryParams.subscribe((params) => {
        this.trendType = params.type;
        // this.courseId = params['id'];
      });
       // added employee div Drop Down
       this.divIds =this.utilService.getDivisions() ? this.utilService.getDivisions() :'';
    }
    

  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.headerService.setTitle({title: this.commonLabels.labels.expiringTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    this.roleId = this.utilService.getRole();
    this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
    this.filterResort = this.resortId ? this.resortId : null;
    this.getExpireTrendList('')
    this.getResortList();
  }

  getExpireTrendList(filter){
    let query =  this.resortId  ? '&resortId='+this.resortId : '';
    if(filter){
        query = query+filter
    }else{
      // added employee div Drop Down
      query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
    }
    if(this.roleId == 4){
      let user = this.utilService.getUserData();
      query = query+'&createdBy='+user.userId;
  }
    this.commonService.getExpireTrendList(query,this.courseId,this.trendType).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.trendsVar.employeeList = resp.data.rows;
      }
      else{
        this.trendsVar.employeeList = [];
      }
    })
  }

  getResortList(){
    if(this.roleId != 1){
        this.commonService.getResortForFeedback(this.resortId).subscribe(item=>{
            if(item && item.isSuccess){
                this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                this.filterSelect(this.filterResort,'resort')
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
    if(type == "resort"){
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        this.resortService.getResortByParentId(this.filterResort).subscribe((result) => {
            if (result.isSuccess) {
                 // added employee div Drop Down
                 this.allDivisions = result.data.divisions;
                 if(this.divIds.length > 0 && this.roleId === 4){
                     this.divisionList = [];
                     this.allDivisions.filter(g => this.divIds.includes(g.divisionId)).map(g =>{
                         this.divisionList.push(g);
                     });
                 }else{
                     this.divisionList = result.data.divisions;
                 }
                  // added employee div Drop Down
                let query = "&resortId="+this.filterResort;
                this.getExpireTrendList(query);
            }
        })

    }
    else if(type == "division"){
        this.filterDept = null;
        this.filterUser = null;
        let obj = { 'divisionId': this.filterDivision };
        this.commonService.getDepartmentList(obj).subscribe((result) => {
            if (result.isSuccess) {
                this.departmentList = result.data.rows;
            }
            let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision;
            this.getExpireTrendList(query);
        })
    }
    else if(type == "dept"){
        this.filterUser = null;
        let data = { 'departmentId': this.filterDept, 'createdBy': ' ' };
        this.roleId != 1 ? data.createdBy =  this.utilService.getUserData().userId : delete data.createdBy;
        this.userService.getUserByDivDept(data).subscribe(result => {
            if (result && result.data) {
                this.empList = result.data;
            }
            let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
            this.getExpireTrendList(query);
        })
    }
    else if(type == "emp"){
        let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+this.filterUser;
        this.getExpireTrendList(query);
    }

}

resetFilter(){
    this.filterDivision =null;
    this.filterDept = null;
    this.filterUser = null;
    this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
    this.filterResort = this.resortId;
    this.getExpireTrendList('');
}

ngOnDestroy(){
  this.trendsVar.employeeList = [];
}
getListArray(data,type){
  if(data.length){
    let arr = [];
    if(type == 'division'){
      let details = data.map(item=>{
        let div = item.Division ? item.Division.divisionName : '';
        return div
      })
      arr = Array.from(details.reduce((m, t) => m.set(t, t), new Map()).values());
    }
    else if(type == 'dept'){
      let details = data.map(item=>{
        let dept = item.Department ? item.Department.departmentName : '';
        return dept;
      })
      arr = Array.from(details.reduce((m, t) => m.set(t, t), new Map()).values());
    }
    return arr
  }
  else{
    return ''
  }
}

getCalculateDue(expireTrend){
  let DaysDiff;
  if(expireTrend && expireTrend.TrainingSchedule && expireTrend.TrainingSchedule.dueDate){
    let currentDate = new Date();
    let dueDate = new Date(expireTrend.TrainingSchedule.dueDate);
    let timeDiff = dueDate.getTime() - currentDate.getTime();
    DaysDiff = timeDiff / (1000 * 3600 * 24);
    DaysDiff =  Math.round(DaysDiff);
  }else{
    DaysDiff = '-';
  }
  return DaysDiff;
}
selectEmployee(data,checked){
  if(checked){
    let i = this.trendsVar.employeeList.findIndex(d=>d.userId == data.userId);
    this.trendsVar.employeeList[i].checked = true;
    this.selectedEmp.push(data.userId);
    this.selectAllEmp = this.trendsVar.employeeList.every(function (item: any) {
      return item.checked == true;
    });
  }
  else{
    let index = this.selectedEmp.findIndex(d=>d == data.userId);
    let i = this.trendsVar.employeeList.findIndex(d=>d.userId == data.userId);
    this.trendsVar.employeeList[i].checked = false;
    this.selectedEmp.splice(index,1);
    this.selectAllEmp = false;
  }
}

selectAll(check){
  if(check){
    this.trendsVar.employeeList.forEach(item=>{
      this.selectedEmp.push(item.userId);
      item.checked = true;
    })
    this.selectAllEmp = true;
  }
  else{
    this.trendsVar.employeeList.forEach(item=>{
      item.checked = false;
    })
    this.selectedEmp = [];
    this.selectAllEmp = false;
  }
}

openNotificationModel(template : TemplateRef<any>){
  if(this.selectedEmp.length){
    this.reportingError = false;
    this.showReporters = null;
    this.hideReporters = 'hide';
    this.reportingMangerList = [];
    this.reporter = [];
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }else{
    this.alertService.error('Please select minimum one employee');
  }
}

reportersSelect(type){
  this.showReporters = type;
  if(this.showReporters == 'show'){
    this.getReporterList();
    this.hideReporters = null;
  }
  else{
    this.reportingMangerList = [];
    this.reporter = [];
    this.showReporters = null;
  } 
}

getReporterList(){
  let query =  {userIds:[]};
  query.userIds = this.selectedEmp;
  this.commonService.getReportingManager(query).subscribe(resp=>{
    if(resp && resp.isSuccess){
      let arr =  resp.data.map(item=>{
        let obj ;
        if(item.reportDetails){
          obj = {
            userId : item.reportDetails.userId,
            userName : item.reportDetails.userName 
          }
        }
        else{
          obj = '';
        }
        return obj;
      })
      this.reportingMangerList = arr.filter(function(x){
        return (x != "");
      });
    }
  })
}

  sendNotification(){
    let params={
      userIds : [],
      typeSet : '',
      createdBy : this.utilService.getUserData().userId,
      courseId : '',
      trainingClassId : '',
      comments : this.comments
    }
    if(!this.showReporters || this.showReporters != 'show' || this.showReporters =='show' && this.reporter.length){
      this.reportingError = false;
      if(this.showReporters == 'show'){
        params.userIds = this.reporter.map(item=>{ return item.userId});
        params.typeSet = 'toAllReportManager';
      }
      else{
        params.userIds = this.selectedEmp;
        params.typeSet = 'toAllEmployee';
      }
      if(this.trendType == 'course'){
        params.courseId = this.courseId;
        delete params.trainingClassId; 
      }
      else{
        params.trainingClassId = this.courseId;
        delete params.courseId; 
      }
      this.commonService.sendExpireNotification(params).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.resetData();
          this.alertService.success(resp.message)
        }
      },err=>{
        this.resetData();
        this.alertService.error(err.error.error)
      })
    }
    else{
      this.reportingError = true;
      // this.alertService.error('Please select minimum one reporting manager')
    }
  }

  resetData(){
    this.showReporters = null;
    this.hideReporters = 'hide';
    this.reportingMangerList = [];
    this.selectedEmp = [];
    this.reporter = [];
    this.comments = '';
    this.modalRef.hide();
    this.getExpireTrendList('');
    this.selectAllEmp = false;
  }
}
