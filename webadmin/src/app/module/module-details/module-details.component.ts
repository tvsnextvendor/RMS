import { Component, OnInit,TemplateRef } from '@angular/core';
import { VideoVar } from '../../Constants/video.var';
import { HttpService } from '../../services/http.service';
import { HeaderService } from '../../services/header.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Params } from '@angular/router';
// import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import {ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';


@Component({
    selector: 'app-module-details',
    templateUrl: './module-details.component.html',
    styleUrls: ['./module-details.component.css'],
})

export class ModuleDetailsComponent implements OnInit {

    description;
    videoFile;
    videoName;
    videoSubmitted = false;
    message;
    showImage = false;
    uploadFile;
    fileUrl;
    previewImage;
    videoIndex;
    
    constructor(public videoVar: VideoVar,public moduleVar: ModuleVar,private activatedRoute: ActivatedRoute,private modalService:BsModalService,public http: HttpService, private headerService: HeaderService,private alertService:AlertService) { 
        this.activatedRoute.params.subscribe((params: Params) => {
            this.moduleVar.moduleId = params['moduleId'];
            this.moduleVar.courseId = params['courseId'];
        });
        this.moduleVar.url=API_URL.URLS;
    }
    
    modalRef: BsModalRef;
  
    
    ngOnInit() {  
        this.headerService.setTitle({title:this.moduleVar.title, hidemodule: false});
        this.getVideoList();
    }


    //get videoList 
    getVideoList(){
        this.http.get(this.moduleVar.url.moduleCourseList).subscribe((data)=>{
                const respData=data.moduleList;
                respData.forEach((key, index) => {
                    if(key.moduleId == this.moduleVar.moduleId){              
                          this.moduleVar.selectedModule= respData[index];
                      }
                   });
                   this.moduleVar.selectedModule.courseList.forEach((key,index) => {
                      if(key.courseId == this.moduleVar.courseId){
                        this.moduleVar.selectedCourse = this.moduleVar.selectedModule.courseList[index];   
                        console.log( this.moduleVar.selectedCourse)  
                      }
                   })                  
        })
    }

    openModal(template: TemplateRef<any>, data,type,index) {
        if(type === "video"){
            this.moduleVar.videoLink= data;
            this.modalRef = this.modalService.show(template);
        }
        else{
            this.showImage = true;
            this.videoName = data.videoTitle;
            this.videoFile = data.videoLink;
            this.description = data.videoDescription;
            this.previewImage = "assets/videos/images/bunny.png";
            this.videoIndex = index;
            this.modalRef = this.modalService.show(template);
        } 
    }
    cancelVideoSubmit(){
        this.modalRef.hide();
        this.videoName = '';
        this.videoFile = '';
        this.description = '';
        this.showImage = false;
        this.showImage = false;
    }

    videoSubmit(){
        this.videoSubmitted = true;
        if(this.videoName && this.videoFile && this.description){
            let i = this.videoIndex;
            this.moduleVar.selectedCourse.videos[i].videoTitle = this.videoName;
            this.moduleVar.selectedCourse.videos[i].videoLink = this.videoFile;
            this.moduleVar.selectedCourse.videos[i].videoDescription = this.description;
            this.modalRef.hide();
            this.message = "Video updated successfully"
            this.alertService.success(this.message);
        }
        else{
            console.log("video submitted error");
        }
    }
    messageClose(){
        this.message = '';
        // console.log("messege redsad")
      } 

      fileUpload(e){
        this.showImage = true;
        console.log(e);
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
          this.uploadFile = file;
          this.fileUrl = reader.result;
        }
      reader.readAsDataURL(file)
      this.previewImage = "assets/videos/images/bunny.png";
      console.log(this.fileUrl,this.uploadFile)
    }
    
}