import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoVar {
    videoFormLabels = {
        courseName       : 'Course Name',
        videoTitle       : 'Video Title',
        videoDescription : 'Description',
        uploadVideos     : 'Upload Videos',
        active           : 'Active'
    };
    btns = {
        addBtn : 'ADD NEW',
        add    : 'ADD',
        assign : 'ASSIGN',
        yes    : 'Yes',
        no     : 'No',
        create : 'Create',
        cancel : 'Cancel'
     };
     modalLabels ={
       title      : 'Add New Course Name',
       courseName : 'Course Name'
     };
     mandatoryLabels ={
         videoTitle  : 'Video Title is required',
         courseName  : 'Course Name is required',
         description : 'Description is required',       
     };
    courses:any=[];
    moduleList:any=[];
    moduleType=null;

}