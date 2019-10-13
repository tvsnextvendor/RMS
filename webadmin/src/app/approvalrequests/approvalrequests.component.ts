import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, UtilService, ResortService, BreadCrumbService, CommonService, UserService, AlertService } from '../services';
import { CommonLabels } from '../Constants/common-labels.var';
import { BatchVar } from '../Constants/batch.var';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-approvalrequests',
  templateUrl: './approvalrequests.component.html',
  styleUrls: ['./approvalrequests.component.css']
})

export class ApprovalrequestsComponent implements OnInit {
  resortId;
  userData;
  selectedResort;
  selectedDivision = [];
  selectedDepartment = [];
  selectedEmp = [];
  divisionList = [];
  resortList = [];
  departmentList = [];
  employeeList = [];
  submitted = false;
  approvalList;
  pendingList;
  rejectedList;
  approvals;
  modalRef;
  rejectComment;
  rejectViewComment;
  showUsers: boolean = false;
  createdByList;
  approvalAccess;
  roleId;
  pageSize;
  p;
  approvalStatus;
  approvalStatusSet;
  totalCount;
  levelApprovalError = false;
  selectedTab;
  requestorId;

  constructor(private headerService: HeaderService,
    public commonLabels: CommonLabels,
    private breadCrumbService: BreadCrumbService,
    private utilService: UtilService,
    private resortService: ResortService,
    private commonService: CommonService,
    private userService: UserService,
    private alertService: AlertService,
    private route: Router,
    public batchVar: BatchVar, private modalService: BsModalService) { }

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    this.selectedTab = 'Pending';
    this.approvalAccess = null;
    this.headerService.setTitle({ title: 'Approval Request', hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.userData = this.utilService.getUserData();

    this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
    this.getResortData(this.resortId);
    this.getApprovalList(this.resortId, 'Pending');
    this.approvalStatusSet = 'Pending'; 
    this.getusers();
  }

  pageChanged(e){
    // alert(e);
    this.p = e;
    this.getApprovalList(this.resortId,this.approvalStatusSet);
   }

  getusers() {
    let query = this.resortId ? "?resortId="+this.resortId : ''; 
    this.commonService.getCreatedByDetailsByResort(query).subscribe(result => {
      if (result && result.isSuccess) {
        this.createdByList = result.data && result.data;
          let user = this.utilService.getUserData();
          let userId = user && user.userId;
          this.createdByList =  this.createdByList.filter(item=>item.userId != userId);
      } else {
        this.createdByList = [];
      }
    })
  }

  getResortData(resortId) {
    this.resortService.getResortByParentId(resortId).subscribe((result) => {
      (this.resortId == parseInt(resortId)) ? this.resortList = result.data.Resort : '';
      this.divisionList = result.data.divisions;
      this.selectedResort = resortId;
    });
  }
  sendSecondLevelApproval(){
    this.showUsers = true;
    this.approveStatus();
  }

  dontsendSecondLevelApproval(){
    this.showUsers = false;
    this.approveStatus();
  }

  tabChange(status) {
    this.approvalStatusSet = status;
    this.selectedTab = status;
    let userId = this.userData.userId;
    this.resortService.getApprovalList(this.resortId, userId, status,this.p,this.pageSize).subscribe((result) => {
      if (result && result.isSuccess) {
        this.pendingList = result.data.rows;
        this.totalCount = result.data.count;
      } else {
        this.pendingList = [];
        this.totalCount =  0;
      }
    });
  }

  getApprovalList(resortId, status) {
    let userId = this.userData.userId;
    this.resortService.getApprovalList(resortId, userId, status,this.p,this.pageSize).subscribe((result) => {
      if (result && result.isSuccess) {
        this.pendingList = result.data.rows;
        this.totalCount = result.data.count;
      } else {
        this.pendingList = [];
        this.totalCount =  0;
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
    this.batchVar.employeeId = this.selectedEmp.map(item => { return item.userId });
    this.batchVar.departmentId = this.selectedDepartment.map(item => { return item.departmentId });
    this.batchVar.divisionId = this.selectedDivision.map(item => { return item.divisionId });
    this.getDropDownValues(event, key);
    // this.batchVar.empValidate = false;
  }

  getDropDownValues(event, key) {
    if (key == 'div') {
      const obj = { 'divisionId': this.batchVar.divisionId };
      this.commonService.getDepartmentList(obj).subscribe((result) => {
        if (result.isSuccess) {
          this.departmentList = result.data.rows;
        }
      })
    }

    if (key == 'dept') {
      const data = { 'departmentId': this.batchVar.departmentId, 'createdBy': this.utilService.getUserData().userId }
      this.userService.getUserByDivDept(data).subscribe(result => {
        if (result && result.data) {
          this.employeeList = result.data;
        }
      })
    }
  }

  onEmpDeSelect(event) {

  }
  submitRequest() {
    this.submitted = true;
  }
  approveConfirm(template: TemplateRef<any>, approvals) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.approvals = approvals;
    this.showUsers = false;
    this.approvalAccess = null;
    this.requestorId = this.approvals.Requestor.userId;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  rejectConfirm(template: TemplateRef<any>, approvals) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.approvals = approvals;
    this.modalRef = this.modalService.show(template, modalConfig);
  }

  rejectView(template: TemplateRef<any>, item) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.rejectViewComment = item.rejectComment;
    console.log(item)
    this.modalRef = this.modalService.show(template, modalConfig);
  }


  approveStatus() {

    if(!this.showUsers || (this.showUsers && this.approvalAccess)){
      this.levelApprovalError = false;
      let approvalInfo = {
        'approverId': this.userData.userId,
        'approvalStatus': 'Approved',
        'approvalAccess': this.approvalAccess
      }
      this.resortService.statusApproval(this.approvals.approvalId, approvalInfo).subscribe((result) => {
        if (result && result.isSuccess) {
          this.modalRef.hide();
          this.alertService.success(result.message);
          if(!this.approvalAccess){
            this.selectedTab = 'Approved';
            this.tabChange('Approved');
          }
        } else {
          this.alertService.error(result.error);
        }
        if(this.showUsers){
          this.tabChange('Pending');
        }
      }, (errorRes) => {
        this.modalRef.hide();
        this.alertService.error(errorRes.error.error);
      });
    }
    else{
      this.levelApprovalError = true;
    }
  }

  approverSelect(){
    if(this.approvalAccess){
      this.levelApprovalError = false;
    }
  }

  rejectStatus() {
    let approvalInfo = {
      'approverId': this.userData.userId,
      'approvalStatus': 'Rejected',
      'rejectComment': this.rejectComment
    }
    this.resortService.statusApproval(this.approvals.approvalId, approvalInfo).subscribe((result) => {
      if (result && result.isSuccess) {
        this.closePopup();
        this.alertService.success(result.message);
        this.selectedTab = 'Rejected';
        this.tabChange('Rejected');
      } else {
        this.closePopup();
        this.alertService.error(result.message);
      }
    }, (errorRes) => {
      this.closePopup();
      this.alertService.error(errorRes.error.error);
    });
  }
  secondLevelApproval() {
    this.showUsers = !this.showUsers;
  }

  closePopup(){
    this.modalRef.hide();
    this.rejectComment = '';
    this.rejectViewComment = '';
  }
  goCourseView(dataCourse){
   if(dataCourse && dataCourse.Course && dataCourse.Course.courseId){
    this.route.navigateByUrl('/viewCourse/'+dataCourse.Course.courseId);
   }else if(dataCourse && dataCourse.TrainingClass && dataCourse.TrainingClass.trainingClassId){
    this.route.navigateByUrl('/cms-library?type=create&tab=class&classId='+dataCourse.TrainingClass.trainingClassId);
   }else if(dataCourse && dataCourse.Quiz && dataCourse.Quiz.quizId){
    this.route.navigateByUrl('/createQuiz?quizId='+dataCourse.Quiz.quizId);
   }
   
  }
}
