import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../../services/header.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {
    
    autocompleteItemsAsCourseObjects;
    courseItems;
    selectedCourses = [];
    moduleName;
    sortableList;
    videoList = [];
    tabEnable = false;
    selectCourseName;
    selectVideoName;
    description;

   constructor(private headerService:HeaderService,private toastr : ToastrService){}

   ngOnInit(){

      this.autocompleteItemsAsCourseObjects = [
        "Uniform and Appearance Policy",
        "Park Smart Safety" ,
        "Basic Rails" ,
        "Welcome to 2018/19"
     ];

     this.sortableList = [
       {name : "Video Name 1",description : "Description",file:"File1.mp4"},
       {name : "Video Name 2",description : "Description",file:"File2.mp4"},
       {name : "Video Name 3",description : "Description",file:"File3.mp4"},
       {name : "Video Name 4",description : "Description",file:"File4.mp4"},
     ];
   }
  
   removeCourse(i){
    this.selectedCourses.splice(i, 1);   
    console.log(this.selectedCourses,"courseUpdate");
    if(this.selectedCourses.length === 0){
        this.tabEnable = false;
    }
   }

   updateCourse(data){
       console.log(data);
       this.tabEnable = true;
       this.videoList = this.sortableList;
       this.selectCourseName = data.value;
   }

   removeVideo(i){
    this.sortableList.splice(i, 1);   
    console.log(this.sortableList,"courseVideo");
   }

   updateVideo(data){
       console.log(data);
       this.selectVideoName = data.name;
       this.description = data.description;

   }

   changeValue(data){
       console.log(data);
       this.selectedCourses = data;
       if(this.selectedCourses.length === 0){
           this.tabEnable = false;
       }
   }

   addCourse(){
       this.tabEnable = true;
       this.videoList = [];
       this.selectCourseName = '';
       this.selectVideoName = '';
       this.description = '';
    console.log("Add new course")
   } 

   videoSubmit(){
       console.log("video submitted");
       if(this.selectVideoName && this.selectVideoName){
        this.toastr.success("Video updated successfully");
       }
       
       this.selectVideoName = '';
       this.description = '';
   }

   cancelVideoSubmit(){
       this.selectVideoName = '';
       this.description = '';
   }

   submitForm(form){
    console.log(this.moduleName,this.selectedCourses, this.sortableList)
   }
}
