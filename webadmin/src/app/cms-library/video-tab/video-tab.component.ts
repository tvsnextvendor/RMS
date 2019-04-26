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
trainingVideoUrl;
uploadPath;
fileCheck = false;
resortArray = [];
deletedFileId=[];
deletedFilePath=[];
divisionArray = [];
allEmployees = {};
employeesInBatch = [];
selectedCourse="";
selectedClass="";
courseList;
submitted=false;
trainingClassList;
fileList=[];
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
  }

   courseChange(){
     this.selectedClass="";
      this.courseService.getTrainingclassesById(this.selectedCourse).subscribe(result=>{
      if(result && result.isSuccess){       
           this.trainingClassList = result.data;
        }
    })
   }



  getEditFileData(){
      this.courseService.getEditCourseDetails( this.selectedCourse,this.selectedClass).subscribe(resp => {
        if(resp && resp.isSuccess){
          let files = resp.data.length && resp.data[0].CourseTrainingClassMaps.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files.length ? resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files : [] ;
          if(this.fileList){
           files.map(x=>{
             this.fileList.push(x);
           })
          }else{
           this.fileList= files;
          }
        }
      })
  }


  removeVideo(data,i){
    this.fileList.splice(i,1);
    this.deletedFilePath.push(data.fileUrl);
    this.deletedFileId.push(data.fileId);
    if(data.fileType === 'Video'){
      this.deletedFilePath.push(data.fileImage);
    }
    console.log(this.deletedFilePath)
  }

  getCourseFileDetails() {
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet);
    let classId = this.trainingClassId ? this.trainingClassId : '';
    this.courseService.getFiles('Video',classId,this.page,this.pageSize,query).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        this.videoListValue = resp.data && resp.data.rows.length && resp.data.rows;
        this.uploadPath = resp.data.uploadPaths.uploadPath;
      }
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
  
  }
  openEditVideo(template: TemplateRef<any>, data, index) {
    console.log("Open Pop-up");
    this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
    }
    viewTraningVideo(template: TemplateRef<any>, videourl) {
      let modalConfig={
        class:"modal-lg video-box"
      }
      this.constant.modalRef = this.modalService.show(template, modalConfig);
      this.trainingVideoUrl = videourl;
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


  addFiles(event,file,i){
    console.log(this.fileList, file);
    let type=event.target.checked;
    if(type){
      file['addNew'] = true;
      this.fileList.push(file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      this.fileList.splice(index,1);
    }
  }

  AssignNewFiles(){
      this.submitted=true;
      let updatedFileList = this.fileList.filter(function (x) {
          if(x.addNew){
            return delete x.addNew;
          }
      }); 
      let fileIds = updatedFileList.map(a => a.fileId);
      updatedFileList.forEach(function(x){ delete x.fileId });
      let postData = {
        trainingClassId : this.selectedClass,
        courseId : this.selectedCourse,
        fileType :"video",
        assignedFiles: updatedFileList,
        filesIds: fileIds,
     }

    if(this.submitted && this.selectedClass && this.selectedCourse){
      this.courseService.assignVideosToCourse(postData).subscribe(res=>{
            if(res.isSuccess){
              this.alertService.success(res.message);
              this.openAddVideosToCourse();
              this.getCourseFileDetails();
              this.fileCheck= false;
            }
      })
    }
  }

  pageChanged(e){
    this.page = e;
    this.getCourseFileDetails();
  }
}
