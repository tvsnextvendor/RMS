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


@Component({
    selector: 'app-module-details',
    templateUrl: './module-details.component.html',
    styleUrls: ['./module-details.component.css'],
})

export class ModuleDetailsComponent implements OnInit {
   
    constructor(public videoVar: VideoVar,private moduleVar: ModuleVar,private activatedRoute: ActivatedRoute,private modalService:BsModalService,public http: HttpService, private headerService: HeaderService) { 
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
                      }
                   })                  
        })
    }

    openModal(template: TemplateRef<any>, videolink) {
        this.moduleVar.videoLink= videolink;
        this.modalRef = this.modalService.show(template);
    }

}