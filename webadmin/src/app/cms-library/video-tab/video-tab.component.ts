import { Component, TemplateRef, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VideoVar } from '../../Constants/video.var';
import { CommonService, UtilService, ResortService, UserService, AlertService } from '../../services';


@Component({
selector: 'app-video-tab',
templateUrl: './video-tab.component.html',
styleUrls: ['./video-tab.component.css']
})
export class VideoTabComponent implements OnInit {
@Input() trainingClassId;
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
selectedCourse="";
selectedClass="";
courseList;
trainingClassList;
fileList;
@Input() CMSFilterSearchEventSet;


constructor(private courseService: CourseService, private alertService: AlertService ,private modalService: BsModalService, private constant: VideoVar, private commonService: CommonService, private utilService: UtilService, private resortService: ResortService, private userService: UserService) {
   this.labels = constant.videoFormLabels;
}


  ngOnInit(){
    this.pageSize = 10;
    this.page=1;
    this.getCourseFileDetails();
    this.getCourseAndTrainingClass();
  }
  ngDoCheck(){
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getCourseFileDetails();
    }
  }

  getCourseAndTrainingClass(){
    this.courseService.getAllCourse().subscribe(result=>{
      if(result && result.isSuccess){
        this.courseList = result.data && result.data.rows;
      }
    })

    this.courseService.getTrainingClass().subscribe((resp) => {
        if(resp && resp.isSuccess){
          this.trainingClassList = resp.data && resp.data.length && resp.data.map(item=>{
                    let obj = {
                        id : item.trainingClassId,
                        value : item.trainingClassName
                    }
                    return obj;
                })
            }
        })

  }

    getEditFileData(){
      console.log(this.selectedClass);
      this.courseService.getEditCourseDetails( this.selectedCourse,this.selectedClass).subscribe(resp => {
        console.log(resp);
        if(resp && resp.isSuccess){
          this.fileList = resp.data.length && resp.data[0].CourseTrainingClassMaps.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files.length ? resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files : [] ;
        }
      })
  }

  getCourseFileDetails() {
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet);
    let classId = this.trainingClassId ? this.trainingClassId : '';
    this.courseService.getFiles('Video',classId,this.page,this.pageSize,query).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        this.videoListValue = resp.data && resp.data.rows.length && resp.data.rows;
      }
    },err =>{
      this.CMSFilterSearchEventSet = '';
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


   removeDoc(template: TemplateRef<any>,fileId, i) {
    let modalConfig={
      class : "modal-dialog-centered"
    }
     this.constant.fileId= fileId;
     this.constant.modalRef = this.modalService.show(template,modalConfig); 
    }

     deleteDoc(){
     this.courseService.deleteDocument(this.constant.fileId).subscribe((result)=>{
         if(result.isSuccess){
             this.constant.modalRef.hide();
             this.getCourseFileDetails();
             this.alertService.success(result.message);
         }
     })
   }


  pageChanged(e){
    this.page = e;
    this.getCourseFileDetails();
  }
}
