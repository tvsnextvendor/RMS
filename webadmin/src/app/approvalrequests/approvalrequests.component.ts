import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, UtilService, ResortService, BreadCrumbService, CommonService, UserService } from '../services';
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
  approvalId;
  modalRef;

  constructor(private headerService: HeaderService,
    public commonLabels: CommonLabels,
    private breadCrumbService: BreadCrumbService,
    private utilService: UtilService,
    private resortService: ResortService,
    private commonService: CommonService,
    private userService: UserService,
    public batchVar: BatchVar, private modalService: BsModalService) { }

  ngOnInit() {
    this.headerService.setTitle({ title: 'Approval Request', hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.userData = this.utilService.getUserData();
    this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
    this.getResortData(this.resortId);
    this.getApprovalList(this.resortId, 'Pending');
  }

  getResortData(resortId) {
    this.resortService.getResortByParentId(resortId).subscribe((result) => {
      (this.resortId == parseInt(resortId)) ? this.resortList = result.data.Resort : '';
      this.divisionList = result.data.divisions;
      this.selectedResort = resortId;
    })
  }
  tabChange(status) {
    this.resortService.getApprovalList(this.resortId, status).subscribe((result) => {
      if (result && result.isSuccess) {
        this.pendingList = result.data.rows;
      } else {
        this.pendingList = [];
      }
    });
  }
  getApprovalList(resortId, status) {
    this.resortService.getApprovalList(resortId, status).subscribe((result) => {
      if (result && result.isSuccess) {
        this.pendingList = result.data.rows;
      } else {
        this.pendingList = [];
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
    this.approvalId = approvals;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  rejectConfirm(template: TemplateRef<any>, approvals) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.approvalId = approvals;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  approveStatus(){

  }
  rejectStatus(){
    
  }
}
