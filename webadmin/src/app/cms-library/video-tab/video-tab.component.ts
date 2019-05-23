import { Component, TemplateRef, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { VideoVar } from '../../Constants/video.var';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { CommonLabels } from '../../Constants/common-labels.var';
import { CommonService, UtilService, ResortService, UserService, AlertService, FileService } from '../../services';
import * as _ from 'lodash';


@Component({
selector: 'app-video-tab',
templateUrl: './video-tab.component.html',
styleUrls: ['./video-tab.component.css']
})
export class VideoTabComponent implements OnInit {
@Input() trainingClassId;
@Input() uploadPage;
totalVideosCount = 0;
videoListValue = [];
addVideosToCourse = false;
page;
pageSize;
editEnable = false;
labels;
trainingVideoUrl;
uploadPath;
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
fileId;
errorValidation;
errorValidate = false;
@Input() CMSFilterSearchEventSet;
@Output() selectedVideos  = new EventEmitter<object>();


constructor(private courseService: CourseService,private fileService:FileService,private alertService: AlertService ,private modalService: BsModalService, private constant: VideoVar, private commonService: CommonService, private utilService: UtilService, private resortService: ResortService, private userService: UserService,public commonLabels : CommonLabels) {
   this.labels = constant.videoFormLabels;
}

  ngOnInit(){
    this.pageSize = 10;
    this.page=1;
    this.getCourseFileDetails();
    this.getCourseAndTrainingClass();
    //get Resort list
        const resortId = this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId; 
        this.resortService.getResortByParentId(resortId).subscribe((result)=>{
            this.constant.resortList=result.data.Resort;
            this.constant.divisionList=result.data.divisions;

        })
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

  //Get document list for selected course and training class.
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

 //Remove selected video from form
  removeVideo(data,i){
    this.videoListValue.filter(function (x) {
           if(x.fileId == data.fileId){
             return x.selected = false;
           }    
    }); 
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


  //Get File list.
  getCourseFileDetails() {
    let userId = this.utilService.getUserData().userId;
    // let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : '&createdBy='+userId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ;
    let classId = this.trainingClassId ? this.trainingClassId : '';
    let params={
      type: 'Video',
      classId: classId,
      page: this.page,
      size: this.pageSize,
      query: query
    }
    let selectedVideos = this.fileService.getSelectedList('Video');
    this.courseService.getFiles(params).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        if(resp.data.count === 0)
        {
          this.videoListValue = [];
        }else{
          this.videoListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
          // console.log(_.merge(this.videoListValue, selectedVideos));
        }
        this.uploadPath = resp.data.uploadPaths.uploadPath;
      }
      this.CMSFilterSearchEventSet = '';
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });

   
     
  }

  openEditVideo(template: TemplateRef<any>, data, index) {
    let user = this.utilService.getUserData();
    this.popUpReset();
    let roleId = user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    this.fileId = data && data.fileId;
    this.constant.selectedResort = roleId;
    this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
  }

  popUpReset(){
    this.errorValidate = false;
    this.constant.departmentList = [];
    this.constant.employeeList = [];
    this.constant.selectedDepartment = [];
    this.constant.selectedEmp = [];
    this.constant.selectedDivision = [];
  }

    viewTraningVideo(template: TemplateRef<any>, videourl) {
      let modalConfig={
        class:"modal-lg video-box"
      }
      this.constant.modalRef = this.modalService.show(template, modalConfig);
      this.trainingVideoUrl = videourl;
    }

    onEmpSelect(event, key,checkType) {

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
            let listData =_.cloneDeep(this.constant.departmentList);
            this.constant.departmentList = [];
            if(checkType == 'select'){
              listData && listData.length ? 
              result.data.rows.forEach(item=>{listData.push(item)}) : 
              listData = result.data.rows;
              // this.constant.departmentList = listData.map(item=>{return item});
            }
            else{
              result.data.rows.length && 
                result.data.rows.forEach(resp=>{
                  listData.forEach((item,i)=>{
                    if(resp.departmentId == item.departmentId){
                      listData.splice(i,1)
                    }
                  }) 
                })
                this.constant.selectedDepartment = [];
                this.constant.selectedEmp = [];
            }
            this.constant.departmentList = listData.map(item=>{return item});
          }
        })
      }
      if (key == 'dept') {
        const data = { 'departmentId': this.constant.departmentId, 'createdBy': this.utilService.getUserData().userId }
        this.userService.getUserByDivDept(data).subscribe(result => {
          if (result && result.data) {
            // this.constant.employeeList && this.constant.employeeList.length ? result.data.forEach(item=>{this.constant.employeeList.push(item)}) : 
            // this.constant.employeeList = result.data;

            let listData =_.cloneDeep(this.constant.employeeList);
            this.constant.employeeList = [];
            if(checkType == 'select'){
              listData && listData.length ? 
              result.data.forEach(item=>{listData.push(item)}) : 
              listData = result.data;
            }
            else{
              result.data.length && 
              result.data.forEach(resp=>{
                listData.forEach((item,i)=>{
                  if(resp.userId == item.userId){
                    listData.splice(i,1)
                  }
                }) 
              })
              this.constant.selectedEmp = [];
            }
          
            this.constant.employeeList = listData.map(item=>{return item});

            this.allEmployees = result.data.reduce((obj, item) => (obj[item.userId] = item, obj), {});
          }
        })
      }
      if (key == 'emp') {
        if (event.userId && this.allEmployees[event.userId]) {
          this.employeesInBatch.push(this.allEmployees[event.userId]);
        }
      }
      if(this.constant.selectedDivision.length && this.constant.selectedDepartment.length && this.constant.selectedEmp.length ){
        this.errorValidate = false
      }
      this.constant.empValidate = false;
      }
      
    closeEditVideoForm() {
      this.constant.modalRef.hide();
    }
  
    //Hide and show Assign form popup 
    openAddVideosToCourse(){ 
        this.addVideosToCourse = !this.addVideosToCourse;
    }

   //Open delete warning modal
   removeDoc(template: TemplateRef<any>,fileId, i) {
    let modalConfig={
      class : "modal-dialog-centered"
    }
     this.constant.fileId= fileId;
     this.constant.modalRef = this.modalService.show(template,modalConfig); 
    }

  //Delete file 
    deleteDoc(){
    this.courseService.deleteDocument(this.constant.fileId).subscribe((result)=>{
        if(result.isSuccess){
            this.constant.modalRef.hide();
            this.getCourseFileDetails();
            this.alertService.success(result.message);
        }
    })
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
  }

 //Send selected files to cms library component.
  AddFilestoEditCourse(){
    this.selectedVideos.emit(this.fileList);
  }
 
 //To reset form.
  resetAssignForm(){
    this.selectedClass = "";
    this.selectedCourse = "";
    this.fileList =[];
    this.submitted=false;
  }

  //Assign video files to selected course and training class
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
              this.videoListValue.map(function (x) {
                return x.selected = false;     
              }); 
            }
      })
    }
  }

  pageChanged(e){
    this.page = e;
    this.getCourseFileDetails();
  }

  permissionSetSubmit(form: NgForm){
    let user = this.utilService.getUserData();
    let resortId = user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    // console.log(form.value);
    // console.log(this.constant.selectedDepartment,this.constant.selectedEmp,this.constant.selectedDivision,this.allEmployees,this.fileId)
    if(this.constant.selectedDivision.length && this.constant.selectedDepartment.length && this.constant.selectedEmp.length ){
      let params = {
        "divisionId": this.constant.selectedDivision.map(item=>{return item.divisionId}),
        "departmentId" :this.constant.selectedDepartment.map(item=>{return item.departmentId}),
        "resortId" : resortId,
        "employeeId" : this.constant.selectedEmp.map(item=>{return item.userId}),
        "fileId" :  this.fileId
      }
      this.courseService.setPermission(params).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.closeEditVideoForm();
          this.alertService.success(resp.message)
        }
      })
    }
    else{
      this.errorValidation = 'Please select data for all the fields';
      this.errorValidate = true;
    }
  }
}
