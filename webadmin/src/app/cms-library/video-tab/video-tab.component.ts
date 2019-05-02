import { Component, TemplateRef, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VideoVar } from '../../Constants/video.var';
import { CommonLabels } from '../../Constants/common-labels.var';
import { CommonService, UtilService, ResortService, UserService, AlertService } from '../../services';


@Component({
selector: 'app-video-tab',
templateUrl: './video-tab.component.html',
styleUrls: ['./video-tab.component.css']
})
export class VideoTabComponent implements OnInit {
@Input() trainingClassId;
@Input() uploadPage;
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
@Output() selectedVideos  = new EventEmitter<object>();


constructor(private courseService: CourseService, private alertService: AlertService ,private modalService: BsModalService, private constant: VideoVar, private commonService: CommonService, private utilService: UtilService, private resortService: ResortService, private userService: UserService,public commonLabels : CommonLabels) {
   this.labels = constant.videoFormLabels;
}

  ngOnInit(){
    console.log(this.commonLabels)
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

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0 || bytes === null) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
      this.courseService.getEditCourseDetails('Video', this.selectedCourse,this.selectedClass).subscribe(resp => {
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
  }

  timeFormatTransform(value): string {
    // let secs = (value);
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60).toFixed();
 }


  getCourseFileDetails() {
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet);
    let classId = this.trainingClassId ? this.trainingClassId : '';
    let params={
      type: 'Video',
      classId: classId,
      page: this.page,
      size: this.pageSize,
      query: query
    }
    this.courseService.getFiles(params).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        if(resp.data.count === 0)
        {
          this.videoListValue = [];
        }else{
          this.videoListValue = resp.data && resp.data.rows.length && resp.data.rows;
        }
        this.uploadPath = resp.data.uploadPaths.uploadPath;
      }
      this.CMSFilterSearchEventSet = '';
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
  }
  openEditVideo(template: TemplateRef<any>, data, index) {
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
      this.commonService.getDepartmentList(obj).subscribe((result) => {
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
    let type=event.target.checked;
    if(type){
      file['addNew'] = true;
      this.fileList.push(file);
    }else{
      let index = this.fileList.findIndex(x => x.fileId === file.fileId);
      this.fileList.splice(index,1);
    }
  }

  AddFilestoEditCourse(){
    this.selectedVideos.emit(this.fileList);
  }
 
  resetAssignForm(){
    this.selectedClass = "";
    this.selectedCourse = "";
    this.fileList =[];
    this.submitted=false;
  }

  AssignNewFiles(){
      this.submitted=true;
      let self =this;
      let updatedFileList = this.fileList.filter(function (x) {
          if(x.addNew){
             x.trainingClassId = self.selectedClass;
            return delete x.addNew && delete x.TrainingClass;
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
              this.resetAssignForm();
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
