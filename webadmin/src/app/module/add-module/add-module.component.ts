import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { CommonService } from '../../services/restservices/common.service';
import {HeaderService} from '../../services/header.service';
import { CourseService } from '../../services/restservices/course.service';
import { ToastrService } from 'ngx-toastr';
import {AddQuizComponent} from '../add-quiz/add-quiz.component';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';

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
    // selectedCourseIds:any;

   constructor(private courseService : CourseService,private headerService:HeaderService,private elementRef:ElementRef,private toastr : ToastrService,public moduleVar: ModuleVar,private route: Router,private commonService: CommonService, private http: HttpService, private activatedRoute: ActivatedRoute,private alertService:AlertService){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.moduleId = params['moduleId']; 
        });
        this.labels = moduleVar.labels;
        this.moduleVar.title = this.moduleId ? this.labels.editCourse : this.labels.createCourse;
   }

   ngOnInit(){
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
    this.courseData();
   }

    courseData(){
        this.http.get(this.moduleVar.api_url.getModuleCourseList).subscribe((resp) => {
            this.moduleVar.courseList = resp.courseDetails;
        })
        this.http.get(this.moduleVar.api_url.getModuleDetails).subscribe((data) => {
            this.moduleVar.moduleList = data.moduleList;
            if(this.moduleId){
                this.moduleVar.moduleObj = this.moduleVar.moduleList.find(x=>x.moduleId === parseInt(this.moduleId));
                this.moduleName = this.moduleVar.moduleObj.moduleName;
                this.topics = this.moduleVar.moduleObj.topics ? this.moduleVar.moduleObj.topics : '';
                let dropdownLIst =  this.moduleVar.moduleObj.courseList.map(item=>{
                    let obj = {
                        id:item.courseId,
                        value : item.courseName
                    }
                    return obj;
                });
                // this.courseList =dropdownLIst;
                this.selectedCourses = dropdownLIst;
                this.moduleVar.selectedCourseIds = dropdownLIst.map(item=>{return item.id})
            }
            // else{
                this.http.get(this.moduleVar.api_url.getCoureseDetails).subscribe((data) => {
                    this.courseDetailsList = data && data.courseList;
                })
            // }
        });
    }

    onItemSelect(item: any) {
        this.moduleVar.selectedCourseIds =  this.selectedCourses.map(item=>{return item.id})
    }
    onItemDeselect(item: any) {
        this.moduleVar.selectedCourseIds =  this.selectedCourses.map(item=>{return item.id})
        // console.log(item,this.moduleVar.selectCourseName);
        if(item.value === this.moduleVar.selectCourseName || this.selectedCourses.length === 0 ){
            this.tabEnable = false;
        }
    }

    fileUpload(e){
        this.showImage = true;
        let reader = new FileReader();
        if(e.target && e.target.files[0]){
            let file = e.target.files[0];
            this.uploadFile = file;
            let type = file.type;
            let typeValue = type.split('/');
            let extensionType = typeValue[1].split('.').pop();
            this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
            console.log(this.fileExtensionType)
            let fileType = typeValue[0];
            this.fileName = file.name;
            reader.onloadend = () => {
            this.fileUrl = reader.result;
            this.extensionTypeCheck(fileType,extensionType,this.fileUrl);
            }
            reader.readAsDataURL(file);  
        }
    }


    extensionTypeCheck(fileType,extensionType,data){
        switch(fileType){
            case "video":
                this.previewImage = "assets/videos/images/bunny.png";
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
                else if(extensionType === "sheet"){
                    this.previewImage = "assets/images/excel-icon.png";
                }  
                else if(extensionType === "document"){
                    this.previewImage = "assets/images/doc-icon.png";
                }  
                else if(extensionType === "zip"){
                    this.previewImage = "assets/images/file-zip-icon.png";
                }  
                break;    
        }

    }

   updateCourse(data,i){
       this.tabEnable = true;
       let courseObj = (this.courseDetailsList.find(item => item.courseId ===  data.id));
       this.moduleVar.videoList = courseObj.videosDetails;
       this.moduleVar.selectCourseName = courseObj.courseName;
       this.moduleVar.courseId = courseObj.courseId;
       this.moduleVar.quizDetails = courseObj.quizDetails;
       this.moduleVar.courseIndex = i;
       if(this.quiz){
            this.quizCheck = false;
           this.quiz.editQuizDetails(this.moduleVar.quizDetails);
       }
       else{
           this.quizCheck = true;
       }
       this.cancelVideoSubmit();
   }

   removeVideo(data,i){
        this.messageClose();
        this.moduleVar.videoList.splice(i, 1);
        this.message = data.videoName + this.labels.removeVideoSuccess;
        this.alertService.success(this.message);
   }

   hideTab(data){
        this.messageClose();
       this.courseSubmitted = true;
       this.moduleVar.quizDetails = [];
        if(this.moduleVar.selectCourseName){
            this.tabEnable = data.courseUpdate ? false : true;
            this.message = data.type ? this.labels.updateCourseSuccess : this.labels.addCourseSuccess;
            this.alertService.success(this.message);
        }
   }

    messageClose(){
        this.message = '';
        this.videoMessage = '';
    } 

   updateVideo(data,i){
       this.showImage = true;
        this.moduleVar.selectVideoName = data.videoName;
        this.moduleVar.description = data.description;
        this.moduleVar.videoFile = data.url;
        // this.previewImage = data.url;
        this.moduleVar.videoIndex = i+1;
        let index =  (this.moduleVar.videoList.findIndex(item => item.videoName ===  data.videoName));
        this.moduleVar.videoId = index + 1
        if(this.quiz){
            this.quizCheck = false;
            this.quiz.editQuizDetails(this.moduleVar.quizDetails);
        }
        let fileExtension = data.url.split('.').pop();
        this.extensionUpdate(fileExtension);
   }

   extensionUpdate(type){
       switch(type){
        case "mp4":
            this.previewImage = "assets/videos/images/bunny.png";
            break;
        case "png":
            this.previewImage = "assets/videos/images/bunny.png";
            break;
        case "jpeg":
            this.previewImage = "assets/videos/images/bunny.png";
            break;
        case "jpg":
            this.previewImage = "assets/videos/images/bunny.png";
            break;
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
        case "xlsx":
            this.previewImage =  "assets/images/excel-icon.png";
            break; 
        case "zip" :
            this.previewImage =  "assets/images/file-zip-icon.png";
            break; 

       }
   }

   addCourse(){
    console.log("Add new course");
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
       let videoObj = {videoName : self.moduleVar.selectVideoName,description : self.moduleVar.description,url:'',fileType:this.fileExtensionType}
        if(this.moduleVar.selectVideoName && this.moduleVar.description && this.moduleVar.videoFile){
            this.message = this.moduleVar.courseId !== '' ? (this.labels.videoUpdatedToast) : (this.labels.videoAddedToast);
            this.commonService.uploadFiles(this.uploadFile).subscribe((result)=>{
                console.log(result,this);
                if(result && result.isSuccess){
                    // self.moduleVar.videoFile = result.data && result.data[0].filename;
                    self.filePath = result.data && result.data[0].path;
                    self.alertService.success(this.message);    
                    self.videoSubmitted = false;
                    videoObj.url = result.data && result.data[0].filename;
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
           //this.toastr.error(this.labels.mandatoryFields)
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
        // console.log("validationFalse")
        this.moduleVar.moduleNameCheck = this.moduleId ? (parseInt(this.moduleId) !== validation.moduleId ?  true : false) : true;
    }
    else{
        // console.log("validation True")
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
            //this.toastr.error(this.labels.courseNameError);
            this.alertService.error(this.labels.courseNameError);
        }
        else if(!this.moduleVar.videoList.length){
            //this.toastr.error(this.labels.videoError);
            this.alertService.error(this.labels.videoError);
        }
   }

    submitForm(){
        this.moduleSubmitted = true;
        // this.quiz  && this.quiz.quizSubmit();   
        if(this.moduleName && this.topics && this.selectedCourses.length && !this.moduleVar.moduleNameCheck){
            let params = {
                "CourseName":this.moduleName,
                "Topics" : this.topics,
                "TrainingClassIds":this.moduleVar.selectedCourseIds.toString(),
            }
            console.log("params-course",params)
            // this.toastr.success(this.labels.moduleCreateMsg);  
            let successMsg =  this.moduleId ? this.labels.moduleUpdateMsg : this.labels.moduleCreateMsg;
            this.route.navigateByUrl("/modulelist");
            this.alertService.success(successMsg);
            this.moduleSubmitted = false;
        }
        else if(!this.moduleName){
            this.alertService.error(this.labels.moduleName+this.labels.isRequire)
        }
        else if(!this.topics){
            this.alertService.error(this.labels.topics+this.labels.isRequire)
        }
        else if(!this.selectedCourses.length){
            this.alertService.error(this.labels.moduleNameValidation)
        }
    }
   
}
