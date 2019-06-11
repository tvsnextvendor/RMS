import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {BreadCrumbService,CourseService,UtilService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

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

  constructor(private breadCrumbService : BreadCrumbService,
    public commonLabels :CommonLabels,
    private courseService :CourseService,
    private utilService :UtilService,
    private router :Router ) { }

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    let data = [{title : this.commonLabels.labels.edit,url:'/cms-library'},{title : this.commonLabels.labels.notification,url:''}]
    this.breadCrumbService.setTitle(data)
    let userData= this.utilService.getUserData();
    this.roleId = this.utilService.getRole();
    this.resortId = userData.ResortUserMappings.length &&  userData.ResortUserMappings[0].Resort.resortId;
    this.getNotificationData();
  }

  getNotificationData(){
    let query = this.roleId != 1 ? '?resortId='+this.resortId : '';
    this.courseService.getNotification(query).subscribe(resp=>{
      console.log(resp)
      if(resp && resp.isSuccess){
        this.notifyListValue = resp.data.rows.length ? resp.data.rows :[];
        this.totalCount = resp.data.count;
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

  goToNotifyEdit(id){
    this.router.navigate(['/cms-library'],{queryParams : {notifyId : id,type:"create",tab:"notification"}});
  }
}
