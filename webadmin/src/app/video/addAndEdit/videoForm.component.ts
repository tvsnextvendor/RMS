import { Component, OnInit,TemplateRef,ViewChild, ElementRef } from '@angular/core';
import { VideoVar } from '../../Constants/video.var';
import {HttpService} from '../../services/http.service'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-videoForm',
    templateUrl: './videoForm.component.html',
    styleUrls: ['./videoForm.component.css'],
})
export class VideoFormComponent implements OnInit {
   
    // @ViewChild('addCourse') BsModalService: ElementRef;

    modalRef: BsModalRef;
    video: any = {
        courseName: null,
        videoTitle: '',
        description: '',
        uploadVideos: ''
    };
    courses:any=[];

    constructor(public videoVar: VideoVar,private route: Router,private headerService: HeaderService,private toastr: ToastrService, private http: HttpService, private modalService: BsModalService) { }

    ngOnInit() {
       this.getCourses();
       this.headerService.setTitle('Add Videos');
    }

    getCourses() {
        this.http.get('5c0660b4330000bb4ce81634').subscribe((data) => {
            this.courses = data;
            console.log(data);
        });
    }

    videoSubmit() {
      console.log(this.video);
      this.toastr.success("Video Added Successfully");
      this.route.navigateByUrl('/videos');
    }
    
    onChangeCourse(course,template){
        console.log(course);
        if(course == 'newCourse'){
          this.openModal(template);
          this.video.courseName= null;
        }
    }

    
  fileChange(event) 
  {
      
    let fileList: FileList = event.target.files;
    console.log(event,"EVENT");
    console.log(fileList, "FILE");
  }

  createNewCourse(courseName){
      this.toastr.success('New Course created successfully');
      this.modalRef.hide();
  }


    openModal(template: TemplateRef<any>) {
                this.modalRef = this.modalService.show(template);

   }
}