import { Component, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common'; 
import {Router, ActivatedRoute, Params } from '@angular/router';
import {CourseService,BreadCrumbService, AlertService} from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-content-file',
  templateUrl: './content-file.component.html',
  styleUrls: ['./content-file.component.css']
})
export class ContentFileComponent implements OnInit {

  courseId;
  trainingVideoUrl;
  fileList;
  uploadPath;
  modalRef : BsModalRef;
  fileId;
  
  constructor(private breadCrumbService :BreadCrumbService,private alertService: AlertService,private activatedRoute: ActivatedRoute, public commonLabels: CommonLabels,private modalService:BsModalService,private courseService: CourseService,public location :Location) {
      this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['id']; 
     });
   }

  ngOnInit() {
    let data = [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.labels.contentFile,url:''}]
    this.breadCrumbService.setTitle(data);
     this.getContentFiles();
    }

    getContentFiles(){
      let params = {
        courseId : this.courseId
       }
      this.courseService.getFiles(params).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.fileList = resp.data.rows;
        this.uploadPath = resp.data && resp.data.uploadPaths ? resp.data.uploadPaths.uploadPath : '';
        }
      })
    }

    viewTraningVideo(template: TemplateRef<any>, videourl) {
      let modalConfig={
        class:"modal-lg video-box"
      }
      this.modalRef = this.modalService.show(template, modalConfig);
      this.trainingVideoUrl = videourl;
    }

     openFileContent(fileUrl){
      let url = this.uploadPath+fileUrl;
      window.open(url, "_blank");
     }

    
  //Open delete warning modal
   removeDoc(template: TemplateRef<any>,fileId, i) {
      let modalConfig={
        class : "modal-dialog-centered"
      }
     this.fileId= fileId;
     this.modalRef = this.modalService.show(template,modalConfig); 
    }

    //Delete document
  deleteDoc(){
  this.courseService.deleteDocument(this.fileId).subscribe((result)=>{
      if(result.isSuccess){
          this.modalRef.hide();
          this.getContentFiles();
          this.alertService.success(result.message);
      }
  })
  }

}
  

