import { Component, OnInit, EventEmitter, Input, Output,TemplateRef } from '@angular/core';
import { HeaderService,HttpService,CourseService,CommonService,AlertService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CmsLibraryVar } from '../../Constants/cms-library.var';

@Component({
  selector: 'app-course-tab',
  templateUrl: './course-tab.component.html',
  styleUrls: ['./course-tab.component.css']
})
export class CourseTabComponent implements OnInit {
  enableEdit = false;
  enableIndex;
  enableDuplicate = false;
  enableView = false;
  labels;
  totalCourseCount = 0;
  courseListValue = [];
  selectedEditCourse;
  selectedEditCourseName;
  trainingClassList =[];
  selectedEditTrainingClass;
  selectedCourse = [];
  pageSize;
  p;
  total;
  fileList;
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

  constructor(private courseService : CourseService ,public cmsLibraryVar : CmsLibraryVar,private modalService : BsModalService,private commonService:CommonService,private alertService : AlertService) { }

  @Output() SelectedcourseList = new EventEmitter<object>();
  @Output() trainingClassRedirect = new EventEmitter<object>();
  @Input()  CMSFilterSearchEventSet;
  @Input() addedFiles;
  @Output() upload= new EventEmitter<Boolean>();
  

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    this.getCourseDetails();
    
  }
  ngDoCheck(){
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getCourseDetails();
    }
    
  }

  getCourseDetails(){
    this.deletedFileId  = [];
    let query = this.CMSFilterSearchEventSet ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : '';
    this.courseService.getCourse(this.p,this.pageSize,query).subscribe(resp=>{
      this.CMSFilterSearchEventSet = '';
      if(resp && resp.isSuccess){
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
        if(this.addedFiles){
           this.selectedIndex = localStorage.getItem('index');
           this.enableDropData('edit',parseInt(this.selectedIndex));
        }
      }
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
   
  }

  enableDropData(type,index){

    localStorage.setItem('index', index)
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
      this.editCourseData(index,'');

    }
    else if(type === "duplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = true;
    }
    else if(type === 'trainingClass'){
      let value = {tab : 'training'}
      this.trainingClassRedirect.emit(value);
    }
  }

  editCourseData(index,id){
    let checkData = id ? this.courseListValue.findIndex(x=>x.courseId === parseInt(id)) : index;
    this.courseListValue.forEach((item,i)=>{
      if(i===checkData){
        this.selectedEditCourse = item.courseId;
        this.selectedEditCourseName  = item.courseName;
        this.trainingClassList = item.CourseTrainingClassMaps;
        this.selectedEditTrainingClass = this.trainingClassList[0].trainingClassId;
      }
    })
    this.getEditFileData(this.selectedEditTrainingClass);
  }

  getEditFileData(classId){
    this.selectedEditTrainingClass = classId;
    this.courseService.getEditCourseDetails( this.selectedEditCourse,classId).subscribe(resp => {
      if(resp && resp.isSuccess){
        this.fileList = resp.data.length && resp.data[0].CourseTrainingClassMaps.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files.length ? resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Files : [] ;
        if(this.addedFiles){
          this.addedFiles.forEach(element => {
               this.fileList.push(element);
          });
        }
      }
    })
  }

  pageChanged(e){
      this.p = e;
      this.getCourseDetails();
  }

  selectCourse(courseId,courseName, isChecked){
    if(isChecked){
      this.selectedCourse.push({'courseId':courseId, 'courseName': courseName});
    }else {
        let index = this.selectedCourse.indexOf(courseId);
        this.selectedCourse.splice(index,1);
      }
    this.SelectedcourseList.emit(this.selectedCourse);
  }

  showCMSLibrary(){
    this.upload.emit(true);
  }

  calculateContentFiles(courses){
    let i =0;
    courses.forEach(function(value,key){
      i = i + parseInt(value.TrainingClass.Files.length);
    });
    return i;
  }

   // To Calc File Size
  calculateFileMbSize(courses){
    let i = 0;
    courses.forEach(function(value,key){
      value.TrainingClass.Files.forEach(function(val,key){
        i = i + val.fileSize;
      });
    });
    return this.formatBytes(i,2);
  }
  formatBytes(bytes,decimals){
    if(bytes == 0) return '0 Bytes';
      var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
   }

  fileUploadPopup(template  : TemplateRef<any>){
    let modalConfig={
      
        class : "custom-modal"
    }
    this.clearData();
    this.modalRef = this.modalService.show(template,modalConfig);
  }

  submitUpload(){
    let self = this;
    this.videoSubmitted = true;
    let videoObj = {fileName : self.uploadFileName,fileDescription : self.description,fileUrl:'',fileType:this.fileExtensionType,fileExtension:this.fileExtension,fileImage:'',filePath:'',fileSize:'',trainingClassId:this.selectedEditTrainingClass}
     if(this.uploadFileName && this.description && this.videoFile){
        //  this.message = this.moduleVar.courseId !== '' ? (this.labels.videoUpdatedToast) : (this.labels.videoAddedToast);
         // console.log(viewImageFile,'fileeeeee');
         this.commonService.uploadFiles(this.uploadFile).subscribe((result)=>{
             if(result && result.isSuccess){
                 if(videoObj.fileType === 'Video'){
                     self.commonService.uploadFiles(self.fileImageDataPreview).subscribe((resp)=>{
                         let fileImagePath =  resp.data && resp.data[0].path;
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
                     self.fileList.push(videoObj);
                //  }
             }
         })
         this.clearData();
     }
    else{
        //this.toastr.error(this.labels.mandatoryFields)
        // this.alertService.error(this.labels.mandatoryFields);
    }
  }

  cancelUpload(){
    this.modalRef.hide();
    this.clearData();
  }

  removeVideo(data,i){
    console.log(data,i)
    this.fileList.splice(i,1);
    this.deletedFilePath.push(data.fileUrl);
    this.deletedFileId.push(data.fileId);
    if(data.fileType === 'Video'){
      this.deletedFilePath.push(data.fileImage);
    }
    console.log(this.deletedFilePath)
  }

  updateCourse(){
    let self =this;
     this.fileList.filter(function (x) {
          if(x.addNew){
            x.trainingClassId = self.selectedEditTrainingClass ;
            return delete x.addNew && delete x.TrainingClass;
          }
      }); 
    let params = {
      'trainingClassId' : this.selectedEditTrainingClass,
      'courseName' : this.selectedEditCourseName,
      'fileIds' : this.deletedFileId,
      'files' : this.fileList
    }
    this.courseService.updateCourseList(this.selectedEditCourse,params).subscribe(resp=>{
      console.log(resp);
      if(resp && resp.isSuccess){
        this.enableDropData('closeEdit','');
        this.getCourseDetails();
        this.alertService.success('Course updated successfully');
      }
    })
  }

  fileUpload(e){
    this.showImage = true;
    let reader = new FileReader();
    if(e.target && e.target.files[0]){
        let file = e.target.files[0];
        document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
        this.uploadFile = file;
        let type = file.type;
        let typeValue = type.split('/');
        let extensionType = typeValue[1].split('.').pop();
        if( typeValue[0].split('.').pop() === 'image' && extensionType === 'gif'){
            this.videoFile = '';
        }
        else{
            this.fileExtension = extensionType;
            this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
            if(this.fileExtensionType === 'Video'){
                this.filePreviewImage(file);
            }
            let fileType = typeValue[0];
            this.fileName = file.name;
            reader.onloadend = () => {
            this.fileUrl = reader.result;
            if(fileType === 'application'){
                let appType = (this.fileName.split('.').pop()).toString();
                let appDataType = appType.toLowerCase();
                this.extensionUpdate(appDataType)
            }
            else{
                this.extensionTypeCheck(fileType,extensionType,this.fileUrl);
            }   
        }
        }
        reader.readAsDataURL(file);  
    }
}

filePreviewImage(file){
    let self = this;
        var fileReader = new FileReader(); 
          fileReader.onload = function() {
            var blob = new Blob([fileReader.result], {type: file.type});
            var url = URL.createObjectURL(blob);
            var video = document.createElement('video');
            var timeupdate = function() {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
                video.pause();
              }
            };
            video.addEventListener('loadeddata', function() {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
              }
            });
            var snapImage = function() {
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
                self.fileImageDataPreview =  new File([blob], "File_name.png");
                // self.fileImageDataPreview.type = "image/png";
                console.log(self.fileImageDataPreview)
            })  
            // Load video in Safari / IE11
            video.muted = true;
            //video.playsInline = true;
            video.play();
          };
          fileReader.readAsArrayBuffer(file);   
}
extensionTypeCheck(fileType,extensionType,data){
    switch(fileType){
        case "video":
            this.previewImage = "";
            break;
        case "image":
            this.previewImage = data;
            break;
        case "text":
            this.previewImage =  "assets/images/txt-icon.png";   
            break;
        case "application":
            if(extensionType === "ms-powerpoint"){
                this.previewImage =  "assets/images/ppt-icon.png";  
            } 
            else if(extensionType === "pdf"){
                this.previewImage =  "assets/images/pdf-icon.png";  
            }   
            else if(extensionType === "sheet" || extensionType === 'ms-excel'){
                this.previewImage = "assets/images/excel-icon.png";
            }  
            else if(extensionType === "document" || extensionType === 'msword'){
                this.previewImage = "assets/images/doc-icon.png";
            }  
            else if(extensionType === "zip"){
                this.previewImage = "assets/images/file-zip-icon.png";
            }  
            break;    
    }

}

extensionUpdate(type){
  switch(type){
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
       this.previewImage =  "assets/images/ppt-icon.png";  
       break;
   case "pdf":
       this.previewImage =  "assets/images/pdf-icon.png";
       break;
   case "txt":
       this.previewImage =  "assets/images/txt-icon.png"; 
       break;
   case "docx":
       this.previewImage =  "assets/images/doc-icon.png"; 
       break;
   case "doc":
       this.previewImage =  "assets/images/doc-icon.png"; 
       break;
   case "xlsx":
       this.previewImage =  "assets/images/excel-icon.png";
       break;
   case "xls":
       this.previewImage =  "assets/images/excel-icon.png";
       break;     
   case "zip" :
       this.previewImage =  "assets/images/file-zip-icon.png";
       break; 

  }
}

clearData(){
  this.uploadFileName = '';
  this.description = '';
  this.videoFile = '';
  this.showImage = false;
  this.previewImage = '';
  this.fileName = '';
  this.fileExtensionType = '';
}

}

