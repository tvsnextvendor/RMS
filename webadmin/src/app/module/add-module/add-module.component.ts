import { Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService } from '../../services/http.service';
import {HeaderService} from '../../services/header.service';
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
    moduleName;
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
    // selectedCourseIds:any;

   constructor(private headerService:HeaderService,private elementRef:ElementRef,private toastr : ToastrService,private moduleVar: ModuleVar,private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute,private alertService:AlertService){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.moduleId = params['moduleId']; 
        });
        this.labels = moduleVar.labels;
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
    myEl.innerHTML = ' <span class="newCourseId addcourse" (click)="addCourse()" id="newCourseId"><i class="fa fa-plus pr-2"></i> <span class="addnewcourse-title">Add New Course</span></span>';
    let ele = this.elementRef.nativeElement.querySelector('.newCourseId');
    ele.onclick = this.addCourse.bind(this);
    this.moduleVar.tabKey = 1;
    this.courseData();
   }

    courseData(){
        this.http.get(this.moduleVar.api_url.getCoursesList).subscribe((resp) => {
            this.moduleVar.courseList = resp.courseDetails;
        })
        this.http.get(this.moduleVar.api_url.getModuleDetails).subscribe((data) => {
            this.moduleVar.moduleList = data.moduleList;
            if(this.moduleId){
            this.moduleVar.moduleObj = this.moduleVar.moduleList.find(x=>x.moduleId === parseInt(this.moduleId));
            this.moduleName = this.moduleVar.moduleObj.moduleName;
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
            else{
                this.http.get(this.moduleVar.api_url.getCoureseDetails).subscribe((data) => {
                    this.moduleVar.moduleObj = data;
                })
            }
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
        console.log(e);
        let reader = new FileReader();
        let file = e.target.files[0];
        this.fileName = file.name;
        reader.onloadend = () => {
          this.uploadFile = file;
          this.fileUrl = reader.result;
        }
      reader.readAsDataURL(file)
      this.previewImage = "assets/videos/images/bunny.png";
      console.log(this.fileUrl,this.uploadFile,this.fileName)
    }

   updateCourse(data,i){
       this.tabEnable = true;
       let courseObj = (this.moduleVar.moduleObj.courseList.find(item => item.courseId ===  data.id));
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
        this.previewImage = data.url;
        this.moduleVar.videoIndex = i+1;
        let index =  (this.moduleVar.videoList.findIndex(item => item.videoName ===  data.videoName));
        this.moduleVar.videoId = index + 1
        if(this.quiz){
            this.quizCheck = false;
            this.quiz.editQuizDetails(this.moduleVar.quizDetails);
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
        this.moduleVar.quizDetails = [];
        this.quiz.editQuizDetails(data);
    }
   }
   videoSubmit(){
        this.messageClose();
       this.videoSubmitted = true;
        if(this.moduleVar.selectVideoName && this.moduleVar.description && this.moduleVar.videoFile){
            this.message = this.moduleVar.courseId !== '' ? (this.labels.videoUpdatedToast) : (this.labels.videoAddedToast); 
            this.alertService.success(this.message);
            this.videoSubmitted = false;
            let videoObj = {
                videoName : this.moduleVar.selectVideoName ,
                description : this.moduleVar.description,
                url : this.fileName ? this.fileName : this.moduleVar.videoFile
            }
            if(this.moduleVar.videoIndex){
                let index = this.moduleVar.videoIndex - 1;
                this.moduleVar.videoList[index] = videoObj;
                this.moduleVar.videoIndex = 0;
            }
            else{
                this.moduleVar.videoList.push(videoObj);
            }
            this.moduleVar.selectVideoName = '';
            this.moduleVar.description = '';
            this.moduleVar.videoFile = '';
            this.showImage = false;
            this.previewImage = '';
            this.fileName = '';
        }
       else{
           //this.toastr.error(this.labels.mandatoryFields)
           this.alertService.error(this.labels.mandatoryFields);
       }
   }

   cancelVideoSubmit(){
       this.moduleVar.selectVideoName = '';
       this.moduleVar.description = '';
       this.moduleVar.videoFile = '';
       this.previewImage = '';
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

    submitForm(form){
        this.moduleSubmitted = true;
        // this.quiz  && this.quiz.quizSubmit();   
        if(this.moduleName && this.selectedCourses.length && !this.moduleVar.moduleNameCheck){
            let params = {
                "ModuleName":this.moduleName,
                "CourseIds":this.moduleVar.selectedCourseIds.toString(),
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
        else if(!this.selectedCourses.length){
            this.alertService.error(this.labels.moduleNameValidation)
        }
    }
   
}
