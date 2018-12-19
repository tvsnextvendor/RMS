import { Component, OnInit,ViewChild} from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService } from '../../services/http.service';
import {HeaderService} from '../../services/header.service';
import { ToastrService } from 'ngx-toastr';
import {AddQuizComponent} from '../add-quiz/add-quiz.component';
import {ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {
    
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild(AddQuizComponent)
    private quiz: AddQuizComponent;
    
    courseList = [];
    courseItems = [];
    dropdownSettings;
    selectedCourseIds = [];
    courseId;
    videoId;
    moduleId;
    videoFile;
    moduleObj;
    selectedCourses = [];
    moduleName;
    sortableList;
    videoList = [];
    tabEnable = false;
    selectCourseName;
    selectVideoName;
    description;
    courseIndex;
    tabKey;
    api_url;

   constructor(private headerService:HeaderService,private toastr : ToastrService,private moduleVar: ModuleVar,private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute){
    this.activatedRoute.params.subscribe((params: Params) => {
        this.moduleId = params['moduleId'];
    });
   }

   ngOnInit(){
    this.api_url = API_URL.URLS;
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'value',
        enableCheckAll : false,
        itemsShowLimit: 8,
        // allowSearchFilter: true
      };   
    this.tabKey = 1;
    this.courseData();
   }

    courseData(){
        this.http.get(this.api_url.getCoursesList).subscribe((resp) => {
            this.courseList = resp.courseDetails;
        })
        if(this.moduleId){
            this.http.get(this.api_url.getModuleList).subscribe((data) => {
                this.moduleVar.moduleList = data.moduleList;
                this.moduleObj = this.moduleVar.moduleList.find(x=>x.moduleId === parseInt(this.moduleId));
                this.moduleName = this.moduleObj.moduleName;
                let dropdownLIst =  this.moduleObj.courseList.map(item=>{
                    let obj = {
                        id:item.courseId,
                        value : item.courseName
                    }
                    return obj;
                });
                // this.courseList =dropdownLIst;
                this.selectedCourses = dropdownLIst;
                this.selectedCourseIds = dropdownLIst.map(item=>{return item.id})
            });
        }
    }

   onItemSelect(item: any) {
    // console.log(item,this.selectedCourses)
    this.selectedCourses.push(item);
    this.selectedCourseIds.push(item.id);

  }
  onItemDeselect(item: any) {
    let index= this.selectedCourses.findIndex(x=>x.id === item.id);
    this.selectedCourses.splice(index, 1);
    if(this.selectedCourses.length === 0 || this.courseIndex === index){
        this.tabEnable = false;
        // this.resetTabDetails();
    }
  }

   updateCourse(data,i){
       this.tabEnable = true;
       let courseObj = (this.moduleObj.courseList.find(item => item.courseName ===  data.value));
       this.videoList = courseObj.videosDetails;
       this.selectCourseName = courseObj.courseName;
       this.courseId = courseObj.courseId;
       if(this.quiz){
           this.quiz.editQuizDetails();
       }
       this.cancelVideoSubmit();
   }

   removeVideo(i){
    this.videoList.splice(i, 1);
   }

   hideTab(data){
       this.tabEnable = data ? false : true;
   }

   updateVideo(data){
        this.selectVideoName = data.videoName;
        this.description = data.description;
        this.videoFile = data.url;
        let index =  (this.videoList.findIndex(item => item.videoName ===  data.videoName));
        this.videoId = index + 1
        if(this.quiz){
            this.quiz.editQuizDetails();
        }

   }

   addCourse(){
    console.log("Add new course");
    this.resetTabDetails(true);
   } 

   resetTabDetails(add){
    this.tabEnable = add ? true : false;
    this.videoList = [];
    this.selectCourseName = '';
    this.selectVideoName = '';
    this.description = '';
    this.courseIndex = '';
    this.courseId = '';
    this.videoId = '';
    if(this.quiz && add){
           this.quiz.editQuizDetails();
    }
   }
   videoSubmit(){
       console.log("video submitted");
       if(this.selectVideoName && this.description && this.videoFile){
        this.courseId !== '' ? this.toastr.success("Course videos updated successfully") : this.toastr.success("Course videos added successfully"); 

        let videoObj = {
            videoName : this.selectVideoName ,
            description : this.description,
            url : this.videoFile
        }
        this.videoList.push(videoObj);
        this.selectVideoName = '';
        this.description = '';
       }
       else{
           this.toastr.error("mandatory fields missing")
       }
   }

   cancelVideoSubmit(){
       this.selectVideoName = '';
       this.description = '';
   }

   tabChange(){
        if(this.selectCourseName && this.videoList.length){
            this.staticTabs.tabs[1].disabled = false;
            this.staticTabs.tabs[1].active = true;
        }
        else if(!this.selectCourseName){
            this.toastr.error("Course name is mandatory");
        }
        else if(!this.videoList.length){
            this.toastr.error("Minimum one video data required");
        }
  
   }

    submitForm(form){
        // this.quiz  && this.quiz.quizSubmit();   
        if(this.moduleName && this.selectedCourses){

            let params = {
                "ModuleName":this.moduleName,
                "CourseIds":this.selectedCourseIds.toString(),
                }
            console.log("params-course",params)
            this.toastr.success("Module Created Successfully");  
            this.route.navigateByUrl('/modulelist')
        }
        else{
            this.toastr.error("Unable to create module ")
        }
    }
   
}
