import { Component, TemplateRef, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VideoVar } from '../../Constants/video.var';
import { CommonService, UtilService, ResortService, UserService } from '../../services';


@Component({
selector: 'app-video-tab',
templateUrl: './video-tab.component.html',
styleUrls: ['./video-tab.component.css']
})
export class VideoTabComponent implements OnInit {
@Input() videoId;
totalVideosCount = 0;
videoListValue;
addVideosToCourse = false;
page;
pageSize;
editEnable = false;
labels;
resortArray = [];
divisionArray = [];
allEmployees = {};
employeesInBatch = [];


constructor(private courseService: CourseService, private modalService: BsModalService, private constant: VideoVar, private commonService: CommonService, private utilService: UtilService, private resortService: ResortService, private userService: UserService) {
this.labels = constant.videoFormLabels;
}


  ngOnInit(){
    this.pageSize = 10;
    this.page=1;
    console.log(this.videoId)
    this.getCourseFileDetails();
  }
  getCourseFileDetails() {
    this.courseService.getFiles('Video',this.page,this.pageSize).subscribe(resp => {
      console.log(resp);
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        this.videoListValue = resp.data && resp.data.rows.length && resp.data.rows;
      }
    });
  }
  openEditVideo(template: TemplateRef<any>, data, index) {
    console.log("Open Pop-up");
    this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
    }

    onEmpSelect(event, key) {

      if (event.divisionId) {
      this.constant.divisionId = event.divisionId;
      } else if (event.departmentId) {
      this.constant.departmentId = event.departmentId;
      } else {
      this.constant.divisionId = '';
      this.constant.departmentId = '';
      }
      
      if (key == 'div') {
      const obj = { 'divisionId': this.constant.divisionId };
      console.log(obj);
      this.commonService.getDepartmentList(obj).subscribe((result) => {
      console.log(result);
      if (result.isSuccess) {
      this.constant.departmentList = result.data.rows;
      }
      })
      }
      if (key == 'dept') {
      const data = { 'divisionId': this.constant.divisionId, 'departmentId': this.constant.departmentId, 'createdBy': this.utilService.getUserData().userId }
      this.userService.getUserByDivDept(data).subscribe(result => {
      if (result && result.data) {
      this.constant.employeeList = result.data;
      this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
      }
      })
      }
      if (key == 'emp') {
      if (event.userId && this.allEmployees[event.userId]) {
      this.employeesInBatch.push(this.allEmployees[event.userId]);
      }
      }
      this.constant.empValidate = false;
      }
      
      closeEditVideoForm() {
      this.constant.modalRef.hide();
      }
  openAddVideosToCourse(){
   
    this.addVideosToCourse = !this.addVideosToCourse;
  }
  pageChanged(e){
    console.log(e)
    this.page = e;
    this.getCourseFileDetails();
  }
}
