import { Component, OnInit,TemplateRef,ViewChild, ElementRef } from '@angular/core';
import { VideoVar } from '../../Constants/video.var';
import {HttpService} from '../../services/http.service'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';


@Component({
    selector: 'app-videoForm',
    templateUrl: './videoForm.component.html',
    styleUrls: ['./videoForm.component.css'],
})
export class VideoFormComponent implements OnInit {
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    
    employeeItems;
    groupItems;
    // form: FormGroup;
    autocompleteItemsAsGroupObjects;
    autocompleteItemsAsEmpObjects;
    modalRef: BsModalRef;
    video: any = {
        courseName: null,
        videoTitle: '',
        description: '',
        uploadVideos: '',
        active: 'yes'
    };
    courses:any=[];
    

// autocompleteItemsAsGroupObjects = [
// {value: 'Group 1', id: 1, extra: 1},
// {value: 'Group 2', id: 2, extra: 1},
// {value: 'Group 3', id: 3, extra: 1},
// ];

// autocompleteItemsAsEmpObjects=[
// {value: 'John', id: 1, extra: 1},
// {value: 'Adam', id: 2, extra: 1},
// {value: 'Lorem', id: 3, extra: 1}
// ];


    constructor(public videoVar: VideoVar,private route: Router,private headerService: HeaderService,private toastr: ToastrService, private http: HttpService, private modalService: BsModalService) { }

    ngOnInit() {
       this.getCourses();
       this.headerService.setTitle('');
       this.staticTabs.tabs[1].disabled = true;
       this.getGroups();
    }
  
    getCourses() {
        this.http.get('5c0660b4330000bb4ce81634').subscribe((data) => {
            this.courses = data;
        });
    }

    getGroups(){
        this.http.get('5c0807a5300000b638d25e86').subscribe((data) => {
          const resData = data.EmployeeList;
          this.autocompleteItemsAsGroupObjects = resData.map(a => a.employeeGroup);
          this.autocompleteItemsAsEmpObjects=resData.map(a => a.employeeName);
        });
    }
  

    videoSubmit() {
        if(this.video.uploadVideos == ''){
            this.toastr.error("Upload Video");
        }else{
      this.staticTabs.tabs[1].disabled = false;
      this.staticTabs.tabs[1].active = true;
        }
    }

    saveAssigned(){
     this.toastr.success("Video Added Successfully");
     this.route.navigateByUrl('/videos');
    }

    onItemAdded(group){
    
      console.log(group, "GROUP");
    }
    
    onChangeCourse(course,template){
        if(course == 'newCourse'){
          this.openModal(template);
          this.video.courseName= null;
        }
    }

    
  fileChange(event) 
  {
    let fileList: FileList = event.target.files;
  }

  createNewCourse(courseName){
      this.toastr.success('New Course created successfully');
      this.modalRef.hide();
  }


    openModal(template: TemplateRef<any>) {
                this.modalRef = this.modalService.show(template);

   }
}