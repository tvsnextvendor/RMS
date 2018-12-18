import { Component, OnInit,ViewChild} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import { ToastrService } from 'ngx-toastr';
import {AddQuizComponent} from '../add-quiz/add-quiz.component';

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {
    

    @ViewChild(AddQuizComponent)
    private quiz: AddQuizComponent;
    
    courseList = [];
    courseItems = [];
    dropdownSettings;
    courseId;
    videoId;
    videoFile;
    selectedCourses = [];
    moduleName;
    sortableList;
    videoList = [];
    tabEnable = false;
    selectCourseName;
    selectVideoName;
    description;
    courseIndex;

   constructor(private headerService:HeaderService,private toastr : ToastrService){}

   ngOnInit(){

      this.courseList = [
       {id : 1, value:"Uniform and Appearance Policy"},
        {id : 2,value : "Park Smart Safety" },
        {id : 3,value : "Basic Rails" },
        {id : 4,value :  "Welcome to 2018/19"}
     ];

     this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'value',
        enableCheckAll : false,
        itemsShowLimit: 5,
        // allowSearchFilter: true
      };

     this.sortableList = [
       {name : "Video Name 1",description : "Description",file:"File1.mp4"},
       {name : "Video Name 2",description : "Description",file:"File2.mp4"},
       {name : "Video Name 3",description : "Description",file:"File3.mp4"},
       {name : "Video Name 4",description : "Description",file:"File4.mp4"},
     ];
   }
  

   onItemSelect(item: any) {
    console.log(item,this.selectedCourses)
    this.selectedCourses.push(item);

  }
  onItemDeselect(item: any) {
    let index= this.selectedCourses.findIndex(x=>x.id === item.id);
    this.selectedCourses.splice(index, 1);
    if(this.selectedCourses.length === 0 || this.courseIndex === index){
        this.tabEnable = false;
        // this.resetTabDetails();
    }
    console.log(this.selectedCourses)
  }

   updateCourse(data,i){
       this.tabEnable = true;
       this.videoList = this.sortableList;
       this.selectCourseName = data.value;
       this.courseIndex = i;
       let index = (this.courseList.findIndex(item => item.value ===  data.value));
       this.courseId =  index + 1;
       if(this.quiz){
        //    this.quiz.courseId = this.courseId ? this.courseId : null;
           this.quiz.editQuizDetails();
       }
       this.cancelVideoSubmit();
   }

   removeVideo(i){
    this.videoList.splice(i, 1);
   }

   updateVideo(data){
        this.selectVideoName = data.name;
        this.description = data.description;
        this.videoFile = data.file;
        let index =  (this.sortableList.findIndex(item => item.name ===  data.name));
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
       if(this.selectVideoName && this.description){
        this.courseId !== '' ? this.toastr.success("Video updated successfully") : this.toastr.success("Video added successfully"); 

        let videoObj = {
            name : this.selectVideoName ,
            description : this.description,
            file : "File"+' '+(this.videoList.length+1)+".mp4"
        }
        this.videoList.push(videoObj);
       }
       else{
           this.toastr.error("mandatory fields missing")
       }
       
       this.selectVideoName = '';
       this.description = '';
   }

   cancelVideoSubmit(){
       this.selectVideoName = '';
       this.description = '';
   }

   submitForm(form){
    console.log(this.moduleName,this.selectedCourses, this.videoList);
    this.quiz.quizSubmit();   }
}
