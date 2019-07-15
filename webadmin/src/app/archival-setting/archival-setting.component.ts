import { Component, OnInit,TemplateRef } from '@angular/core';
import { HeaderService,BreadCrumbService,CommonService,ResortService,AlertService,CourseService } from '../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../Constants/common-labels.var'

@Component({
  selector: 'app-archival-setting',
  templateUrl: './archival-setting.component.html',
  styleUrls: ['./archival-setting.component.css']
})
export class ArchivalSettingComponent implements OnInit {
  archieveList = [];
  resortList = [];
  courseListValue = [];
  totalCourseCount = 0;
  selectedResortList = null;
  modalConfig;
  modalRef;
  selectedResort = null;
  deleteTime;
  archieveTime;
  archievedId;
  removeArchievedId;
  page;
  pageSize;
  selectedCourseId;

  constructor(private headerService:HeaderService,public commonLabels : CommonLabels,private breadCrumbService :BreadCrumbService,private commonService : CommonService,private modalService :  BsModalService,private resortService : ResortService,private alertService :AlertService,
    private courseService : CourseService) { }

  ngOnInit() {
    this.page = 1;
    this.pageSize = 10;
    this.headerService.setTitle({title:'Archival Setting', hidemodule:false});
      this.breadCrumbService.setTitle([])
      this.getArchieveDetails();
      this.getCourseList();
  }

  getCourseList(){
    this.courseService.getCourse(this.page, this.pageSize,'').subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
      }
    }, err => {
      
    });
  }

  getArchieveDetails(){
    let query = this.selectedResortList ? '?resortId='+this.selectedResortList : '';
    this.commonService.getArchieve(query).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.archieveList = resp.data && resp.data.rows && resp.data.rows.length ? resp.data.rows : []; 
      }
    })
    this.resortService.getResort().subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.resortList = resp.data &&resp.data.rows && resp.data.rows.length ? resp.data.rows : [];
      }
    })
  }

  openEditModal(template: TemplateRef<any>,archievedId,removeArchievedId) {
    if(archievedId){
      this.updateArchieve(archievedId);
      this.modalRef = this.modalService.show(template,this.modalConfig);
    }
    else if(removeArchievedId){
      this.removeArchievedId = removeArchievedId;
      this.modalRef = this.modalService.show(template,this.modalConfig);
    }
    else{
      this.modalRef = this.modalService.show(template,this.modalConfig);
    }
  }

  updateArchieve(archievedId){
    this.archievedId = archievedId;
    let query = '?archievedId='+archievedId;
    this.commonService.getArchieve(query).subscribe(resp=>{
      if(resp && resp.isSuccess){
        let response = resp.data && resp.data.rows && resp.data.rows.length ? resp.data.rows : [];
        if(response.length){
          this.selectedResort = response[0].resortId;
          this.archieveTime = response[0].archievedDays;
          this.deleteTime = response[0].deletedDays;
        }
      }
    })
  }

  submitForm(){
    let params = {
      "resortId" : this.selectedResort,
      // "archievedDays" : this.archieveTime,
      "deletedDays":this.deleteTime
    }
    if(this.selectedResort && this.deleteTime){
      if(this.archievedId){
        this.commonService.updateArchieve(this.archievedId,params).subscribe(resp=>{
          if(resp && resp.isSuccess){
            this.closePopup();
            this.alertService.success(resp.message);
            this.getArchieveDetails();
          }
        },err=>{
          console.log(err.error.error);
          this.closePopup();
          this.alertService.error(err.error.error);
        })
      }
      else{
        this.commonService.addArchieve(params).subscribe(resp=>{
          if(resp && resp.isSuccess){
            this.closePopup();
            this.alertService.success(resp.message);
            this.getArchieveDetails();
          }
        },err=>{
          console.log(err.error.error);
          this.closePopup();
          this.alertService.error(err.error.error);
        })
      }
    }
    else{
      this.alertService.error(this.commonLabels.mandatoryLabels.profileMandatory);
    }
  }

  removeArchival(){
    this.commonService.removeArchieve(this.removeArchievedId).subscribe(resp=>{
      console.log(resp)
      if(resp && resp.isSuccess){
        this.closePopup();
        this.alertService.success(resp.message);
        this.getArchieveDetails();
      }
    },err=>{
      console.log(err.error.error);
      this.closePopup();
      this.alertService.error(err.error.error);
    })
  }

  closePopup(){
    this.modalRef.hide();
    this.resetFields();
  }
  resetFields(){
    this.selectedResort = null;
    this.archieveTime = null;
    this.deleteTime = null;
    this.archievedId = null;
  }
  pageChanged(e) {
    this.page = e;
    this.getCourseList();
  }

  deleteConfirmation(template: TemplateRef<any>,courseId) {
    let modalConfig={
      class : "modal-dialog-centered"
    }
     this.selectedCourseId = courseId;
     this.modalRef = this.modalService.show(template,modalConfig); 
    }

    removeCourse(){
      let query = "?deleteUndo=1"
      this.courseService.deleteCourse(this.selectedCourseId,query).subscribe(res=>{
        if(res.isSuccess){
          this.alertService.success(res.message);
          this.modalRef.hide();
          this.getCourseList();
        }else{
          this.modalRef.hide();
          this.alertService.error(res.message);
        }
      },err =>{
        console.log(err);
        this.modalRef.hide();
         this.alertService.error(err.error.error);
      })
    }
}
