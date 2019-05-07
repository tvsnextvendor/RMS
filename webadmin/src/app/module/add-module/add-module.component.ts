import { Component,Input,Output, EventEmitter, OnInit,ViewChild,ElementRef} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService,HeaderService,UtilService,AlertService,CommonService, CourseService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import {AddQuizComponent} from '../add-quiz/add-quiz.component';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {
    
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild(AddQuizComponent)
    private quiz: AddQuizComponent;
    moduleId;
    moduleCourseId;
    selectedCourses = [];
    courseDetailsList = [];
    moduleName;
    topics;
    showImage = false;
    videoSubmitted = false;;
    courseSubmitted = false;
    moduleSubmitted = false;
    uploadFile;
    fileUrl;
    fileName;
    labels;
    tabEnable = false;
    message;
    videoMessage;
    previewImage ;
    quizCheck = false;
    filePath = '';
    fileExtensionType;
    fileImageDataPreview;
    fileDuration;
    removedFileIds = [];
    @Output() upload= new EventEmitter<object>();
    @Output() completed = new EventEmitter<string>();
    @Input() addedFiles;
    // selectedCourseIds:any;

   constructor(private utilService : UtilService,private courseService : CourseService,private headerService:HeaderService,private elementRef:ElementRef,private toastr : ToastrService,public moduleVar: ModuleVar,private route: Router,private commonService: CommonService, private http: HttpService, private activatedRoute: ActivatedRoute,private alertService:AlertService,public commonLabels:CommonLabels){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.moduleId = params['moduleId']; 
        });
        this.labels = moduleVar.labels;
        this.moduleVar.title = this.moduleId ? this.commonLabels.labels.editCourse : this.commonLabels.labels.createCourse;
   }

   ngOnInit(){
    if(this.addedFiles){
        let courseName = this.moduleVar.selectCourseName;
        this.addCourse();
        this.moduleVar.selectCourseName = courseName ;
        this.addedFiles.map(element => {
        this.moduleVar.videoList.push(element)
        })
    }
    this.headerService.setTitle({title:this.moduleVar.title, hidemodule:false});
    this.moduleVar.api_url = API_URL.URLS;
    this.moduleVar.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'value',
        enableCheckAll : false,
        itemsShowLimit: 8,
        // allowSearchFilter: true
      }; 
    var myEl = document.querySelector('ul.item1');
    myEl.innerHTML = ' <span class="newCourseId addcourse" (click)="addCourse()" id="newCourseId"><i class="fa fa-plus pr-2"></i> <span class="addnewcourse-title">Add New Training Class</span></span>';
    let ele = this.elementRef.nativeElement.querySelector('.newCourseId');
    ele.onclick = this.addCourse.bind(this);
    this.moduleVar.tabKey = 1;
    this.courseData('');
   }

    courseData(classId){
        this.courseService.getTrainingClass().subscribe((resp) => {
            if(resp && resp.isSuccess){
                this.moduleVar.courseList = resp.data && resp.data.length && resp.data.map(item=>{
                    let obj = {
                        id : item.trainingClassId,
                        value : item.trainingClassName
                    }
                    return obj;
                }) 
                if(this.moduleId){
                    let id = classId ? classId : '';
                    this.geteditCourseData(id);
                }   
            }
        })
    }
    geteditCourseData(dataId){
        this.courseService.getCourseById(this.moduleId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                let data = resp.data && resp.data.rows.length && resp.data.rows[0];
                this.moduleName = data.courseName;
                this.moduleVar.selectedCourseIds = data && data.CourseTrainingClassMaps.map(item=>{return item.trainingClassId})
                this.selectedCourses = data && data.CourseTrainingClassMaps.map(item=>{
                    let obj = {
                        id : item.trainingClassId,
                        value : item.TrainingClass.trainingClassName
                    }
                    return obj;
                });
                if(dataId !== ''){
                    let checkId = this.moduleVar.selectedCourseIds.find(x=>x===dataId);
                    if(!checkId){
                        this.moduleVar.selectedCourseIds.push(dataId);
                        this.moduleVar.courseList.forEach(item=>{
                            if(item.id === dataId){
                                this.selectedCourses.push(item);
                            }
                        })
                    }
                }
            }
        })
    }

    onItemSelect(item: any) {
        this.moduleVar.selectedCourseIds =  this.selectedCourses.map(item=>{return item.id})
    }
    onItemDeselect(item: any) {
        this.moduleVar.selectedCourseIds =  this.selectedCourses.map(item=>{return item.id})
        if(item.value === this.moduleVar.selectCourseName || this.selectedCourses.length === 0 ){
            this.tabEnable = false;
        }
    }

        
    showCMSLibrary(){
        let obj = {
            'value': true,
            'key': 'course'
        }
        this.upload.emit(obj);      
    }
    
    fileUpload(e){
        this.showImage = true;
        let self = this;
        let reader = new FileReader();
        var duration; 
        if(e.target && e.target.files[0]){
            let file = e.target.files[0];
            // find video duration
            var video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            duration = video.duration;
            self.fileDuration = duration;
            }
            video.src = URL.createObjectURL(file);

            document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
            // find file extension
            this.uploadFile = file;
            let type = file.type;
            let typeValue = type.split('/');
            let extensionType = typeValue[1].split('.').pop();
           
            if( typeValue[0].split('.').pop() === 'image' && extensionType === 'gif'){
                this.alertService.error('Please add the valid file format')
                this.moduleVar.videoFile = '';
            }
            else{
                this.moduleVar.fileExtension = extensionType;
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

   updateCourse(data,i){
       if(this.staticTabs) {
            this.staticTabs.tabs[0].disabled = false;
            this.staticTabs.tabs[0].active = true;
       }   
       this.moduleVar.quizDetails = []; 
       this.moduleVar.courseId = data.id;
       this.courseService.getCourseTrainingClassById(data.id,this.moduleId).subscribe(resp=>{
           console.log(resp);
           if(resp && resp.isSuccess){
               let classData = resp.data && resp.data.rows.length && resp.data.rows[0];
               this.moduleVar.selectCourseName = classData.trainingClassName;
               this.moduleVar.videoList = classData.Files;
               this.tabEnable = true;
           }
           else{
               this.alertService.error('No Data Found')
           }
       })
       this.getEditQuizData(data);
       this.cancelVideoSubmit();
   }

   getEditQuizData(data){
    this.courseService.getTrainingClassQuiz(data.id,'').subscribe(response=>{
        if(response && response.isSuccess){
            this.quizCheck = true;
            let quizData = response.data && response.data[0];
            let questions = quizData.CourseTrainingClassMaps[0].TrainingClass.Questions;
            this.moduleVar.quizDetails = questions;
        }
     })
   }

   removeVideo(data,i){
       if(this.moduleVar.courseId && data.fileId){
           this.removedFileIds.push(data.fileId);
       }
       else{
        this.messageClose();
        let dataContent = data.filePath;
        this.commonService.removeFiles(dataContent).subscribe(result=>{
            if(result && result.isSuccess){
                this.alertService.success('File removed successfully')
            }
        })
       }
       this.moduleVar.videoList.splice(i, 1);
   }

   hideTab(data){
       if(this.moduleVar.courseId){
            this.courseData(this.moduleVar.courseId);
            this.tabEnable = data.courseUpdate ? false : true;
            this.message = data.type ? this.commonLabels.labels.updateCourseSuccess : this.commonLabels.labels.addCourseSuccess;
            this.alertService.success(this.message);
            this.messageClose();
       }
       else{
        this.messageClose();
        this.courseSubmitted = true;
        this.courseData('');
        this.moduleVar.quizDetails = [];
        this.moduleVar.quizDetails = [];
        let newTrainingClass = {
             id : data.resp && data.resp.trainingClass ? data.resp.trainingClass.trainingClassId : '',
             value : data.resp && data.resp.trainingClass ? data.resp.trainingClass.trainingClassName : ''
         }
         
         if(newTrainingClass.id !== ''){
             this.selectedCourses.push(newTrainingClass);
             this.moduleVar.selectedCourseIds.push(newTrainingClass.id);
             data.courseUpdate ? this.submitForm(true) : this.submitForm(false); 
         }
 
         // data.submitCheck ? this.submitForm(true) :this.courseData(); 
         if(this.moduleVar.selectCourseName){
             this.tabEnable = data.courseUpdate ? false : true;
             this.message = data.type ? this.labels.updateCourseSuccess : this.labels.addCourseSuccess;
             this.alertService.success(this.message);
         }
       }   
   }

   resetClassWidget(){
    this.moduleVar.courseList = [];
    this.moduleVar.selectedCourseIds = [];
    this.selectedCourses = [];

   }

    messageClose(){
        this.message = '';
        this.videoMessage = '';
        this.removedFileIds = [];
    } 

   updateVideo(data,i){
       this.showImage = true;
        this.moduleVar.selectVideoName = data.fileName;
        this.moduleVar.description = data.fileDescription;
        this.moduleVar.videoFile = data.fileUrl;
        // this.previewImage = data.url;
        this.moduleVar.videoIndex = i+1;
        let index =  (this.moduleVar.videoList.findIndex(item => item.fileName ===  data.fileName));
        this.moduleVar.videoId = index + 1
        if(this.quiz){
            this.quizCheck = false;
            this.quiz.editQuizDetails(this.moduleVar.quizDetails);
        }
        let fileExtension = data.fileUrl.split('.').pop();
        this.extensionUpdate(fileExtension);
   }

   extensionUpdate(type){
       switch(type){
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

   addCourse(){
    this.resetTabDetails(true);
   } 

   resetTabDetails(add){
    this.tabEnable = add ? true : false;
    this.moduleVar.videoList = [];
    this.moduleVar.selectCourseName = '';
    this.moduleVar.selectVideoName = '';
    this.moduleVar.description = '';
    this.moduleVar.videoFile = '';
    this.moduleVar.courseIndex = '';
    this.moduleVar.courseId = '';
    this.moduleVar.videoId = '';
    this.message = '';
    this.videoMessage = '';
    if(this.quiz && add){
        let data = [];
        this.quizCheck = false;
        this.courseSubmitted = false;
        this.videoSubmitted = false;
        this.moduleVar.quizDetails = [];
        this.quiz.editQuizDetails(data);
    }
   }
   videoSubmit(){
        this.messageClose();
        let self = this;
       this.videoSubmitted = true;
       let videoObj;
       this.moduleVar.courseId ? videoObj = {fileName : self.moduleVar.selectVideoName,fileDescription : self.moduleVar.description,fileUrl:'',fileType:this.fileExtensionType,fileExtension:this.moduleVar.fileExtension,fileImage:'',filePath:'',fileSize:'',fileLength : this.fileDuration,trainingClassId : this.moduleVar.courseId}:
        videoObj = {fileName : self.moduleVar.selectVideoName,fileDescription : self.moduleVar.description,fileUrl:'',fileType:this.fileExtensionType,fileExtension:this.moduleVar.fileExtension,fileImage:'',filePath:'',fileSize:'',fileLength : this.fileDuration}
        if(this.moduleVar.selectVideoName && this.moduleVar.description && this.moduleVar.videoFile){
            this.message = this.moduleVar.courseId !== '' ? (this.labels.videoUpdatedToast) : (this.labels.videoAddedToast);
            this.commonService.uploadFiles(this.uploadFile).subscribe((result)=>{
                if(result && result.isSuccess){
                    if(videoObj.fileType === 'Video'){
                        self.commonService.uploadFiles(self.fileImageDataPreview).subscribe((resp)=>{
                            let fileImagePath =  resp.data && resp.data[0].path;
                            videoObj.fileImage = resp.data && resp.data[0].filename;
                        })
                    }
                    self.filePath = result.path && result.path;
                    self.alertService.success(this.message);    
                    self.videoSubmitted = false;
                    videoObj.fileUrl = result.data && result.data[0].filename;
                    videoObj.fileSize = result.data.length && result.data[0].size;
                    videoObj.filePath = result.path && result.path; 
                    if(self.moduleVar.videoIndex){
                        let index = self.moduleVar.videoIndex - 1;
                        self.moduleVar.videoList[index] = videoObj;
                        self.moduleVar.videoIndex = 0;
                    }
                    else{
                        self.moduleVar.videoList.push(videoObj);
                    }
                }
            })
            this.clearData();
        }
       else{
           this.alertService.error(this.labels.mandatoryFields);
       }
   }

   clearData(){
        this.moduleVar.selectVideoName = '';
        this.moduleVar.description = '';
        this.moduleVar.videoFile = '';
        this.showImage = false;
        this.previewImage = '';
        this.fileName = '';
        this.fileExtensionType = '';
   }

   cancelVideoSubmit(){
       this.moduleVar.selectVideoName = '';
       this.moduleVar.description = '';
       this.moduleVar.videoFile = '';
       this.previewImage = '';
       this.moduleVar.videoIndex = 0;
   }

   checkValidation(){
    let validation = this.moduleVar.moduleList.find(x=>x.moduleName === this.moduleName);
    if(validation){
        this.moduleVar.moduleNameCheck = this.moduleId ? (parseInt(this.moduleId) !== validation.moduleId ?  true : false) : true;
    }
    else{
        this.moduleVar.moduleNameCheck = false;   
    }
       
   }

   tabChange(){
       this.courseSubmitted = true;
        if(this.moduleVar.selectCourseName && this.moduleVar.videoList.length){
            this.staticTabs.tabs[1].disabled = false;
            this.staticTabs.tabs[1].active = true;
        }
        else if(!this.moduleVar.selectCourseName){
            this.alertService.error(this.labels.courseNameError);
        }
        else if(!this.moduleVar.videoList.length){
            this.alertService.error(this.labels.videoError);
        }
   }

   goTocmsLibrary(){
     this.completed.emit('completed'); 
   }

    submitForm(courseSubmitType){
        this.moduleSubmitted = true;
        let user = this.utilService.getUserData();
        if(this.moduleName && this.selectedCourses.length ){
            let params = {
                "courseName":this.moduleName,
                "courseTrainingClasses":this.moduleVar.selectedCourseIds,
                "createdBy" : user.userId,
                "status" : courseSubmitType ? 'workInprogress' : 'none'
            }
            if(this.moduleCourseId || this.moduleId){
                let id = this.moduleCourseId ? this.moduleCourseId : this.moduleId;
                this.courseService.updateCourse(id,params).subscribe((resp)=>{
                    if(resp && resp.isSuccess){
                        if(this.moduleId){
                            this.route.navigateByUrl("/workinprogress"); 
                            this.moduleId = '';
                        }
                        else{
                            if(courseSubmitType) {
                                this.moduleCourseId = '';
                                this.completed.emit('completed');
                            }
                            else{
                                this.staticTabs.tabs[0].disabled = false;
                                this.staticTabs.tabs[0].active = true;
                            }
                        }

                        this.alertService.success(this.labels.moduleUpdateMsg);
                        this.moduleSubmitted = false;
                        
                    }
                })  
            }
            else{
                this.courseService.addCourse(params).subscribe((resp)=>{
                    if(resp && resp.isSuccess){
                        if(courseSubmitType) {
                            this.moduleCourseId = '';
                            this.route.navigateByUrl("/cms-library");
                            this.completed.emit('completed'); 
                        }
                        else{
                            this.moduleCourseId = resp.data.courseId;
                            this.staticTabs.tabs[0].disabled = false;
                            this.staticTabs.tabs[0].active = true;
                        }
                        this.alertService.success(this.labels.moduleCreateMsg);
                        this.moduleSubmitted = false;
                    }
                })
            }
        }
        else if(!this.moduleName){
            this.alertService.error(this.commonLabels.labels.courseName+this.labels.isRequire)
        }
        else if(!this.selectedCourses.length){
            this.alertService.error(this.commonLabels.labels.courseError)
        }
    }

    redirectCourseList(){
        this.route.navigateByUrl('/cms-library');
      }
   
}
