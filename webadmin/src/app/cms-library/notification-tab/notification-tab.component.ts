import { Component, OnInit, Input,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {BreadCrumbService,CourseService,UtilService,FileService,AlertService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notification-tab',
  templateUrl: './notification-tab.component.html',
  styleUrls: ['./notification-tab.component.css']
})
export class NotificationTabComponent implements OnInit {
  resortId;
  roleId;
  notifyListValue = [];
  pageSize;
  p;
  totalCount;
  selectedNotification;
  selectedNotificationList;
  enableView = false;
  enableEdit = false;
  enableDuplicate = false;
  enableIndex;
  assignedCount;
  completedCount;
  fileList=[];
  scheduleEnable = false;
  @Input() uploadPage;
  @Input() CMSFilterSearchEventSet;
  resourseLib = false;
  iconEnable = true;
  userData;
  totalNotifyCount;
  selectedApprovalNotification;
  modalRef;

  constructor(private breadCrumbService : BreadCrumbService,private fileService: FileService,private activatedRoute : ActivatedRoute,public commonLabels :CommonLabels,private courseService :CourseService,private utilService :UtilService,private router :Router ,
    private modalService: BsModalService,private alertService : AlertService) {
    let roleId = this.utilService.getRole();  
    this.activatedRoute.queryParams.subscribe(params=>{ 
       if(params.tab == 'schedule'){
        let data = [{title : this.commonLabels.labels.schedule,url:'/calendar'},{title : this.commonLabels.labels.notification,url:''}]
         this.breadCrumbService.setTitle(data);
         this.scheduleEnable = true;
       }else if(window.location.pathname.indexOf("resource") != -1){
        let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/resource/library'},{title : this.commonLabels.labels.notification,url:''}];
        this.breadCrumbService.setTitle(data);
        this.resourseLib = true;
        }else{
         let data = [{title : this.commonLabels.labels.edit,url:'/cms-library'},{title : this.commonLabels.labels.notification,url:''}]
         this.breadCrumbService.setTitle(data);
         this.resourseLib = false;
       }
     })
     if(roleId == 4 && this.resourseLib){
      this.iconEnable = false;
     }
  }

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    this.userData = this.utilService.getUserData() && this.utilService.getUserData();
    // let userData = this.utilService.getUserData();
    this.roleId = this.utilService.getRole();
    this.resortId = this.userData.ResortUserMappings.length &&  this.userData.ResortUserMappings[0].Resort.resortId;
    this.getNotificationData();
  }

  ngDoCheck() {
    if (this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '') {
      this.p = 1;
      this.getNotificationData();
    } 
  } 

  getNotificationData(){
    let userData = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? 
                  (this.roleId != 1 ? '?page='+this.p+'&size='+this.pageSize+this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&resortId='+this.resortId : '?page='+this.p+'&size='+this.pageSize+this.courseService.searchQuery(this.CMSFilterSearchEventSet)) : 
                    (this.roleId != 1 ? (this.resourseLib  ? '?page='+this.p+'&size='+this.pageSize+'&resortId='+this.resortId :'?page='+this.p+'&size='+this.pageSize+'&resortId='+this.resortId+"&createdBy="+userData.userId) : '');
    let selectedDocuments = this.fileService.getSelectedList('notification');
    if(roleId == 4 ){
      query = this.resourseLib ? (query+"&draft=false") : (query+"&draft=true");
    }    
    this.courseService.getNotification(query).subscribe(resp=>{
      this.CMSFilterSearchEventSet = '';
      if(resp && resp.isSuccess){
         if(resp.data.count === 0)
        {
          this.notifyListValue = [];
          this.totalNotifyCount = resp.data ? resp.data.count : 0;
        }else{
        this.totalNotifyCount = resp.data ? resp.data.count : 0;
        this.notifyListValue = resp.data.rows.length ? resp.data.rows :[];
        if (selectedDocuments) {
          selectedDocuments.map(doc=>{
            this.notifyListValue.map(list =>{
                if(list.File.fileId == doc.fileId){
                  list.File['selected'] = true;
                }
            })
          })           
        }
        this.totalCount = resp.data.count;
      }
      }
    }, err => {
    this.CMSFilterSearchEventSet = '';
  });

   
  }

  selectNotify(notifyId,courseName, isChecked){
    if(isChecked){
      this.selectedNotification.push({'courseId':notifyId, 'courseName': courseName});
    }else {
        let index = this.selectedNotification.indexOf(notifyId);
        this.selectedNotification.splice(index,1);
      }
    this.selectedNotificationList.emit(this.selectedNotification);
  }

  enableDropData(type,index){
    localStorage.setItem('index', index);
    localStorage.setItem('type', type);
    if(type === "view"){
      this.enableView = this.enableIndex === index ? !this.enableView : true;
      this.enableEdit = false;
      this.enableDuplicate = false;
      this.enableIndex = index;
    }
    else if(type === "closeDuplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "closeEdit"){
      this.enableView = false;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "edit"){
      this.enableView = false;
      this.enableEdit = true;
      this.enableDuplicate = false;
      this.enableIndex = index;
    }
    else if(type === "duplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = true;
      this.enableIndex = index;
    }
  }

  getIndividualCourse(course, index){
    this.enableDropData('view',index);
    let data = course;
    let empCount = data && data.totalCount;
    this.assignedCount = data && this.calculatePercent(empCount, data.assignedCount);
    this.completedCount = data && this.calculatePercent(empCount, data.completedCount);
 }

 calculatePercent(totalempCount,individualCount){
  if(totalempCount > 0){
     let totalEmpPer = 100/totalempCount;
     return individualCount*totalEmpPer;
  }else{
    return 0;
  }
}

  //Add or remove files from list
  addFiles(event,file,i){
    let type=event.target.checked;
    if(type){
      file['addNew'] = true;
      file['selected'] = true;
      this.fileList.push(file);
      this.fileService.sendFileList('add',file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      file['selected'] = false;
      this.fileList.splice(index,1);
     this.fileService.sendFileList('remove',file);
    }
  }

  goToNotifyEdit(id){
    if(this.resourseLib){
      this.router.navigate(['/cms-library'],{queryParams : {notifyId : id,type:"create",tab:"notification",library:true}});
    }
    else{
      this.router.navigate(['/cms-library'],{queryParams : {notifyId : id,type:"create",tab:"notification"}});
    }
    
  }
  pageChanged(e){
    this.p = e;
    this.getNotificationData();
}

approvalConfirmation(template: TemplateRef<any>, courses) {
  let modalConfig = {
    class: "modal-dialog-centered"
  }
  this.selectedApprovalNotification = courses;
  this.modalRef = this.modalService.show(template, modalConfig);
}
sendApproval() {
  let userData = this.utilService.getUserData();
  let userId = userData.userId;
  let resortId = userData.ResortUserMappings[0].Resort.resortId
  let approvalData = {
    'contentName': this.selectedApprovalNotification.File && this.selectedApprovalNotification.File.fileName,
    'contentId': this.selectedApprovalNotification.notificationFileId,
    'contentType': 'Notification',
    'resortId': resortId,
    'createdBy': userId,
    'reportingTo': userData.reportingTo
  };
  this.courseService.sendApproval(approvalData).subscribe(result => {
    if (result && result.isSuccess) {
      this.alertService.success(result.message);
    } else {
      this.alertService.error(result.message);
    }
    this.modalRef.hide();
  }, (errorRes) => {
    this.modalRef.hide();
    this.alertService.error(errorRes.error.error);
  });
}
}
