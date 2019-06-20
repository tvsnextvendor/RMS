import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {BreadCrumbService,CourseService,UtilService,FileService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';
import * as _ from 'lodash';

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
  @Input() uploadPage;


  constructor(private breadCrumbService : BreadCrumbService,private fileService: FileService,private activatedRoute : ActivatedRoute,public commonLabels :CommonLabels,private courseService :CourseService,private utilService :UtilService,private router :Router ) {
      this.activatedRoute.queryParams.subscribe(params=>{ 
       if(params.tab == 'schedule'){
        let data = [{title : this.commonLabels.labels.schedule,url:'/calendar'},{title : this.commonLabels.labels.notification,url:''}]
         this.breadCrumbService.setTitle(data)
       }else if(window.location.pathname.indexOf("resource") != -1){
        let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/resource/library'},{title : this.commonLabels.labels.notification,url:''}];
        this.breadCrumbService.setTitle(data);
        }else{
         let data = [{title : this.commonLabels.labels.edit,url:'/cms-library'},{title : this.commonLabels.labels.notification,url:''}]
         this.breadCrumbService.setTitle(data)
       }
     })
     }

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    let userData= this.utilService.getUserData();
    this.roleId = this.utilService.getRole();
    this.resortId = userData.ResortUserMappings.length &&  userData.ResortUserMappings[0].Resort.resortId;
    this.getNotificationData();
  }

  getNotificationData(){
    let query = this.roleId != 1 ? '?resortId='+this.resortId : '';
    let selectedDocuments = this.fileService.getSelectedList('notification');    
    this.courseService.getNotification(query).subscribe(resp=>{
      if(resp && resp.isSuccess){
         if(resp.data.count === 0)
        {
          this.notifyListValue = [];
        }else{
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
    })

   
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
      this.fileService.saveFileList('add',file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      file['selected'] = false;
      this.fileList.splice(index,1);
     this.fileService.saveFileList('remove',file);
    }
    console.log(this.fileList,"cdsjsjdc");
  }

  goToNotifyEdit(id){
    this.router.navigate(['/cms-library'],{queryParams : {notifyId : id,type:"create",tab:"notification"}});
  }
  pageChanged(e){
    this.p = e;
    this.getNotificationData();
}
}
