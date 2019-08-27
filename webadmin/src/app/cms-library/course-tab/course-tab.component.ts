import { Component, OnInit, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService, HttpService, CourseService, CommonService, AlertService, UtilService, BreadCrumbService, FileService,PermissionService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-course-tab',
  templateUrl: './course-tab.component.html',
  styleUrls: ['./course-tab.component.css']
})
export class CourseTabComponent implements OnInit {
  @Output() trainingClassListTab = new EventEmitter();
  @Input() disableEdit;
  enableEdit = false;
  enableIndex;
  enableDuplicate = false;
  enableView = false;
  labels;
  totalCourseCount = 0;
  courseListValue = [];
  selectedEditCourse;
  selectedEditCourseName;
  trainingClassList = [];
  selectedEditTrainingClass;
  selectedCourse = [];
  pageSize;
  p;
  total;
  fileList = [];
  deletedFilePath = [];
  deletedFileId = [];
  modalRef;
  modalConfig;
  previewImage;
  showImage;
  uploadFile;
  videoFile;
  fileExtension;
  fileExtensionType;
  fileName;
  fileUrl;
  fileImageDataPreview;
  videoSubmitted;
  uploadFileName;
  description;
  filePath;
  videoIndex;
  videoList;
  selectedIndex;
  fileDuration;
  selectedCourseId;
  checkBoxEnable;
  breadCrumbTitle;
  individualCourse;
  assignedCount;
  inProgressCount;
  completedCount;
  userData;
  roleId;
  newFileIdsUploadCMS = [];
  schedulePage = false;
  iconEnable = false;
  existingFile = [];
  fileExist = false;
  resourceLib;
  accessSet = false;

  constructor(private breadCrumbService: BreadCrumbService, private activatedRoute: ActivatedRoute, private courseService: CourseService, public commonLabels: CommonLabels, private modalService: BsModalService, private commonService: CommonService, private alertService: AlertService, private utilService: UtilService, private route: Router, private fileService: FileService,private permissionService :PermissionService) {
    this.roleId = this.utilService.getRole();
    this.resourceLib = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.tab == 'schedule') {
        this.breadCrumbTitle = [{ title: this.commonLabels.labels.schedule, url: '/calendar' }, { title: this.commonLabels.labels.course, url: '' }]
        this.schedulePage = true;
      } else if (window.location.pathname.indexOf("resource") != -1) {
        this.breadCrumbTitle = [{ title: this.commonLabels.labels.resourceLibrary, url: '/resource/library' }, { title: this.commonLabels.labels.course, url: '' }]
        this.schedulePage = false;
        this.resourceLib = true;
      } else {
        this.breadCrumbTitle = [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.course, url: '' }]
        this.schedulePage = false;
      }
      if((this.roleId != 4 && !this.schedulePage) || (this.roleId == 4 && !this.resourceLib && !this.schedulePage && this.permissionService.editPermissionCheck('Course'))){
        this.iconEnable = true;
      }
      this.breadCrumbService.setTitle(this.breadCrumbTitle)
    });
  }
  @Output() SelectedcourseList = new EventEmitter<object>();
  @Output() trainingClassRedirect = new EventEmitter<object>();
  @Input()  CMSFilterSearchEventSet;
  @Input()  addedFiles;
  @Output() upload = new EventEmitter<Boolean>();

  ngOnInit() {
    this.pageSize = 10;
    this.p = 1;
    this.enableDropData('closeEdit', '', '');
    this.checkBoxEnable = this.disableEdit ? true : false;
    this.getCourseDetails();
    this.userData = this.utilService.getUserData();
    this.accessSet = this.utilService.getUserData() && this.utilService.getUserData().accessSet && this.utilService.getUserData().accessSet == 'ApprovalAccess' ? true : false;

    if (this.addedFiles && this.addedFiles.length) {
      this.selectedIndex = localStorage.getItem('index');
      this.enableEdit = true;
      this.enableDuplicate = false;
      this.enableView = false;
      this.enableIndex = parseInt(this.selectedIndex);
      this.getEditFileData();
    }
  }

  ngDoCheck() {
    if (this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '') {
      this.getCourseDetails();
    }
  }
  disableView() {
    this.enableView = false;
  }
  //course view
  getIndividualCourse(course, index) {
    this.enableView = true;
    this.enableEdit = false;
    this.enableDuplicate = false;
    this.enableIndex = index;
    this.courseService.getIndividualCourse(course.courseId).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.individualCourse = resp.data;
        let data = this.individualCourse[0];
        let empCount = data && data.totalEmployeeCount;
        this.assignedCount = data && (this.calculatePercent(empCount, data.assignedCount)).toFixed(2);
        this.inProgressCount = data && (this.calculatePercent(empCount, data.inProgressCount)).toFixed(2);
        this.completedCount = data && (this.calculatePercent(empCount, data.completedCount)).toFixed(2);
      }
    });
  }

  getCourseDetails() {
    this.deletedFileId = [];
    let roleId = this.utilService.getRole();
    let user = this.utilService.getUserData();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = this.CMSFilterSearchEventSet && this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? 
                  (roleId != 1 ? (this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&status=none&resortId='+resortId) : 
                    this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&status=none' )  : 
                      (roleId != 1 ? (this.checkBoxEnable ? '&status=none&resortId='+resortId : 
                        '&status=none&resortId='+resortId+'&created='+user.userId) : '&status=none');
    if(roleId == 4){
      query = this.resourceLib ? (query+"&draft=false") : (query+"&draft=true");
    }
    this.courseService.getCourse(this.p, this.pageSize, query).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
      }
    }, err => {
      this.CMSFilterSearchEventSet = '';
    });
  }
  enableDropData(type, index, course) {
    if (type === "closeDuplicate") {
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if (type === "closeEdit") {
      this.enableView = false;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if (type === "edit") {
      this.enableView = false;
      this.enableDuplicate = false;
      this.enableIndex = index;
      this.enableEdit = false;
      this.route.navigate(['/cms-library'], { queryParams: { type:"create",tab:'course','moduleId':  course.courseId} });
    }
    else if(type ===  'saveAsNew'){
      this.enableView = false;
      this.enableEdit = true;
      this.enableDuplicate = false;
      this.enableIndex = index;
      this.editCourseData(course, index);
    }
    else if (type === "duplicate") {
      this.enableView = false;
      this.enableEdit = false;
      this.enableDuplicate = false;
      this.route.navigate(['/cms-library'], { queryParams: { type:"create",tab:'course',duplicate: true,'moduleId':  course.courseId} });
    }
    else if (type === 'trainingClass') {
      let value = { tab: 'training' }
      this.trainingClassRedirect.emit(value);
    }

  }


  deleteConfirmation(template: TemplateRef<any>, courseId) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.selectedCourseId = courseId;
    this.modalRef = this.modalService.show(template, modalConfig);
  }

  tabChange(tabName, id, courseId, count) {
    let data = { tab: tabName, id: '', courseId: id }
    this.trainingClassListTab.next(data);
  }



  getCourseId(index) {
    this.courseListValue.forEach((item, i) => {
      if (i === index) {
        this.selectedCourseId = item.courseId;
      }
    })
  }

  editCourseData(course, index) {
    localStorage.setItem('index', index);
    if (this.selectedIndex != index) {
      this.addedFiles = [];
    }
    this.selectedEditCourse = course.courseId;
    this.selectedEditCourseName = course.courseName;
    this.trainingClassList = course.CourseTrainingClassMaps;
    this.selectedEditTrainingClass = this.trainingClassList[0].trainingClassId;
    this.getEditFileData();
  }

  getEditFileData() {
    if (this.addedFiles.length) {
      let data = localStorage.getItem('edit');
      let storedData = JSON.parse(data);
      this.selectedEditCourse = storedData.course;
      this.selectedEditTrainingClass = storedData.trainingClass;
      this.trainingClassList = storedData.classList;
      this.selectedEditCourseName = storedData.courseName;
    } else {
      let storeData = { course: this.selectedEditCourse, courseName: this.selectedEditCourseName, trainingClass: this.selectedEditTrainingClass, classList: this.trainingClassList };
      localStorage.setItem('edit', JSON.stringify(storeData));
      this.fileService.emptyFileList();
      this.fileService.emptyLocalFileList();
    }
    this.courseService.getEditCourseDetails('', this.selectedEditCourse, this.selectedEditTrainingClass).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.fileList = resp.data.length ? resp.data : [];
        if (this.addedFiles && this.addedFiles.length) {
          this.addedFiles.forEach(element => {
            this.fileList.push(element);
            this.newFileIdsUploadCMS.push(element.fileId);
          });
          this.addedFiles = [];
        }
      } else {
        this.fileList = []
      }
    });
  }

  pageChanged(e) {
    this.p = e;
    this.getCourseDetails();
    this.enableDropData('closeEdit', '', '');
  }

  selectCourse(courseId, courseName, isChecked) {
    if (isChecked) {
      this.selectedCourse.push({ 'courseId': courseId, 'courseName': courseName });
    } else {
      let index = this.selectedCourse.findIndex(item=>item.courseId == courseId);
      this.selectedCourse.splice(index, 1);
    }
    this.SelectedcourseList.emit(this.selectedCourse);
  }

  showCMSLibrary() {
    this.upload.emit(true);
  }


  // To Calc File Size
  calculateFileMbSize(FileMappings) {
    let i = 0;
    FileMappings.forEach(function (value, key) {
      i = i + parseInt(value.File.fileSize);
    });
    return this.formatBytes(i, 2);
  }

  calculatePercent(totalempCount, individualCount) {
    if (totalempCount > 0) {
      let totalEmpPer = 100 / totalempCount;
      return individualCount * totalEmpPer;
    } else {
      return 0;
    }
  }


  formatBytes(bytes, decimals) {
    if (bytes == 0 || bytes === null) return '0 Bytes';
    var k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  fileUploadPopup(template: TemplateRef<any>) {
    let modalConfig = {

      class: "custom-modal"
    }
    this.clearData();
    this.modalRef = this.modalService.show(template, modalConfig);
  }

  submitUpload() {
    let self = this;
    this.videoSubmitted = true;
    let videoObj = { fileName: self.uploadFileName, fileDescription: self.description, fileUrl: '', fileType: this.fileExtensionType, fileExtension: this.fileExtension, fileImage: '', filePath: '', fileSize: '', trainingClassId: this.selectedEditTrainingClass, fileLength: this.fileDuration }
    if (this.uploadFileName && this.description && this.videoFile) {
      //  this.message = this.moduleVar.courseId !== '' ? (this.labels.videoUpdatedToast) : (this.labels.videoAddedToast);
      // console.log(viewImageFile,'fileeeeee');
      this.commonService.uploadFiles(this.uploadFile).subscribe((result) => {
        if (result && result.isSuccess) {
          if (videoObj.fileType === 'Video') {
            self.commonService.uploadFiles(self.fileImageDataPreview).subscribe((resp) => {
              let fileImagePath = resp.data && resp.data[0].path;
              videoObj.fileImage = resp.data && resp.data[0].filename;
            })
          }
          self.videoFile = result.data && result.data[0].filename;
          self.filePath = result.path && result.path;
          //  self.alertService.success(this.message);    
          self.videoSubmitted = false;
          videoObj.fileUrl = result.data && result.data[0].filename;
          videoObj.fileSize = result.data.length && result.data[0].size;
          videoObj.filePath = result.path && result.path;
          //  if(self.videoIndex){
          //      let index = self.videoIndex - 1;
          //      self.videoList[index] = videoObj;
          //      self.videoIndex = 0;
          //  }
          //  else{
          this.modalRef.hide();
          if (!self.fileList.length) {
            self.fileList = [];
          }
          self.fileList.push(videoObj);
          //  }
        }
      })
      this.clearData();
    }
    else {
      //this.toastr.error(this.labels.mandatoryFields)
      // this.alertService.error(this.labels.mandatoryFields);
    }
  }

  cancelUpload() {
    this.modalRef.hide();
    this.fileExist = false;
    this.clearData();
  }

  removeVideo(data, i) {
    this.fileList.splice(i, 1);
    this.deletedFilePath.push(data.fileUrl);
    this.deletedFileId.push(data.fileId);
    if (data.fileType === 'Video') {
      this.deletedFilePath.push(data.fileImage);
    }
  }

  updateCourse(type) {
    let self = this;
    this.fileList.length && this.fileList.filter(function (x) {
      if (x.addNew) {
        x.trainingClassId = self.selectedEditTrainingClass;
        return delete x.addNew && delete x.TrainingClass;
      }
    });
    if (this.selectedEditCourseName && this.fileList.length) {
      let params = {
        'trainingClassId': this.selectedEditTrainingClass,
        'courseName': this.selectedEditCourseName,
        'fileIds': this.deletedFileId,
        'files': this.fileList,
        'createdBy': this.utilService.getUserData().userId,
        'fileUpdateCourse': this.newFileIdsUploadCMS
      }
      if (type === 'edit') {
        this.courseService.updateCourseList(this.selectedEditCourse, params).subscribe(resp => {
          if (resp && resp.isSuccess) {
            this.enableDropData('closeEdit', '', '');
            this.getCourseDetails();
            this.addedFiles = [];
            this.alertService.success(this.commonLabels.labels.moduleUpdateMsg);
          }
        })
      }
      else if (type === 'duplicate') {
        this.courseService.addCourseDuplicate(params).subscribe(resp => {
          if (resp && resp.isSuccess) {
            this.enableDropData('closeEdit', '', '');
            this.getCourseDetails();
            this.addedFiles = [];
            this.alertService.success(this.commonLabels.labels.moduleCreateMsg);
          }
        }, err => {
          console.log(err);
          this.alertService.error(err.error.error);
        })
      }
    }
    else if (!this.selectedEditCourseName) {
      this.alertService.error(this.commonLabels.mandatoryLabels.courseName);
    }
    else if (!this.fileList.length) {
      this.alertService.error(this.commonLabels.mandatoryLabels.videoError);
    }
  }

  saveAsNew() {
    let userData = this.utilService.getUserData();
    let resortId = userData.ResortUserMappings.length && userData.ResortUserMappings[0].Resort.resortId;
    let params = {
      'trainingClassId': this.selectedEditTrainingClass,
      'courseName': this.selectedEditCourseName,
      'fileIds': this.deletedFileId,
      'files': this.fileList,
      'createdBy': this.utilService.getUserData().userId,
      'resortId' : resortId
    };
    this.commonService.saveAsNew(this.selectedEditCourse, params).subscribe(result => {
      // console.log(result, 'result');
      if(result && result.isSuccess){
        this.alertService.success(result.message);
        this.getCourseDetails();
        this.enableView = false;
        this.enableEdit = false;
        this.enableDuplicate = false;
        this.enableIndex = '';

      }
    },err=>{
      this.alertService.error(err.error.error);
    });
  }
  removeCourse() {
    this.courseService.deleteCourse(this.selectedCourseId,'').subscribe(res => {
      if (res.isSuccess) {
        this.alertService.success(res.message);
        this.modalRef.hide();
        this.getCourseDetails();
      } else {
        this.modalRef.hide();
        this.alertService.error(res.message);
      }
    }, err => {
      console.log(err);
      this.modalRef.hide();
      this.alertService.error(err.error.error);
    })
  }

  fileUpload(e) {
    this.showImage = true;
    let self = this;
    this.fileExist = false;
    let reader = new FileReader();
    if (e.target && e.target.files[0]) {
      let file = e.target.files[0];
      if(this.existingFile.length){
        this.existingFile.forEach(item=>{
          if(item == file.name){
            this.fileExist = true;
            this.videoFile = '';
            file = '';
            // this.alertService.warn('File already exist')
          }
        })
      }
      if(!this.fileExist){
        this.existingFile.push(file.name);
        // get video duration
        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          var duration = video.duration;
          self.fileDuration = duration;
        }
        video.src = URL.createObjectURL(file);
        document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
        this.uploadFile = file;
        let type = file.type;
        let typeValue = type.split('/');
        let extensionType = typeValue[1].split('.').pop();
        if (typeValue[0].split('.').pop() === 'image' && extensionType === 'gif') {
          this.videoFile = '';
        }
        else {
          this.fileExtension = extensionType;
          this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
          if (this.fileExtensionType === 'Video') {
            this.filePreviewImage(file);
          }
          let fileType = typeValue[0];
          this.fileName = file.name;
          reader.onloadend = () => {
            this.fileUrl = reader.result;
            if (fileType === 'application') {
              let appType = (this.fileName.split('.').pop()).toString();
              let appDataType = appType.toLowerCase();
              this.extensionUpdate(appDataType)
            }
            else {
              this.extensionTypeCheck(fileType, extensionType, this.fileUrl);
            }
          }
        }
        reader.readAsDataURL(file);
      }
    }
  }

  filePreviewImage(file) {
    let self = this;
    var fileReader = new FileReader();
    fileReader.onload = function () {
      var blob = new Blob([fileReader.result], { type: file.type });
      var url = URL.createObjectURL(blob);
      var video = document.createElement('video');
      var timeupdate = function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
          video.pause();
        }
      };
      video.addEventListener('loadeddata', function () {
        if (snapImage()) {
          video.removeEventListener('timeupdate', timeupdate);
        }
      });
      var snapImage = function () {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL();
        var success = image.length > 100000;
        if (success) {
          var img = document.querySelector('.thumbnail_img');
          img.setAttribute('src', image);
          URL.revokeObjectURL(url);
        }
        return success;
      };
      video.addEventListener('timeupdate', timeupdate);
      video.preload = 'metadata';
      video.src = url;
      // url = video.src; 
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          self.fileImageDataPreview = new File([blob], "File_name.png");
          // self.fileImageDataPreview.type = "image/png";
        })
      // Load video in Safari / IE11
      video.muted = true;
      //video.playsInline = true;
      video.play();
    };
    fileReader.readAsArrayBuffer(file);
  }
  extensionTypeCheck(fileType, extensionType, data) {
    switch (fileType) {
      case "video":
        this.previewImage = "";
        break;
      case "image":
        this.previewImage = data;
        break;
      case "text":
        this.previewImage = "assets/images/txt-icon.png";
        break;
      case "application":
        if (extensionType === "ms-powerpoint") {
          this.previewImage = "assets/images/ppt-icon.png";
        }
        else if (extensionType === "pdf") {
          this.previewImage = "assets/images/pdf-icon.png";
        }
        else if (extensionType === "sheet" || extensionType === 'ms-excel') {
          this.previewImage = "assets/images/excel-icon.png";
        }
        else if (extensionType === "document" || extensionType === 'msword') {
          this.previewImage = "assets/images/doc-icon.png";
        }
        else if (extensionType === "zip") {
          this.previewImage = "assets/images/file-zip-icon.png";
        }
        break;
    }

  }

  extensionUpdate(type) {
    switch (type) {
      // case "mp4":
      //     this.previewImage = "assets/videos/images/bunny.png";
      //     break;
      // case "png":
      //     this.previewImage = "assets/videos/images/bunny.png";
      //     break;
      // case "jpeg":
      //     this.previewImage = "assets/videos/images/bunny.png";
      //     break;
      // case "jpg":
      //     this.previewImage = "assets/videos/images/bunny.png";
      //     break;
      case "ppt":
        this.previewImage = "assets/images/ppt-icon.png";
        break;
      case "pdf":
        this.previewImage = "assets/images/pdf-icon.png";
        break;
      case "txt":
        this.previewImage = "assets/images/txt-icon.png";
        break;
      case "docx":
        this.previewImage = "assets/images/doc-icon.png";
        break;
      case "doc":
        this.previewImage = "assets/images/doc-icon.png";
        break;
      case "xlsx":
        this.previewImage = "assets/images/excel-icon.png";
        break;
      case "xls":
        this.previewImage = "assets/images/excel-icon.png";
        break;
      case "zip":
        this.previewImage = "assets/images/file-zip-icon.png";
        break;

    }
  }
  clearData() {
    this.uploadFileName = '';
    this.description = '';
    this.videoFile = '';
    this.showImage = false;
    this.previewImage = '';
    this.fileName = '';
    this.fileExtensionType = '';
  }
  approvalConfirmation(template: TemplateRef<any>, courses) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.selectedCourse = courses;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  sendApproval(courses) {
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    let resortId = userData.ResortUserMappings[0].Resort.resortId
    let approvalData = {
      'contentName': courses.courseName,
      'contentId': courses.courseId,
      'contentType': 'Course',
      'resortId': resortId,
      'createdBy': userId,
      'reportingTo': userData.reportingTo
    };
    this.courseService.sendApproval(approvalData).subscribe(result => {
      if (result && result.isSuccess) {
        this.modalRef.hide();
        // this.alertService.success(result.message);
        setTimeout(()=>{
          this.alertService.success(result.message);
        },300)
      } else {
        this.modalRef.hide();
        setTimeout(()=>{
          this.alertService.error(result.message);
        },300)  
      }
      
    }, (errorRes) => {
      this.modalRef.hide();
      setTimeout(()=>{
        this.alertService.error(errorRes.error.error);
      },300)
      // this.alertService.error(errorRes.error.error);
    });
  }

  ngOnDestroy(){
    this.fileExist = false;
    this.existingFile = [];
  }
}

