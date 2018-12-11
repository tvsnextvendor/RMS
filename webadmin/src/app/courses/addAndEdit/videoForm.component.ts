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
    resData;
    filterEmployeeList;
    groupName;
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
      // this.staticTabs.tabs[1].disabled = true;
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
      console.log(group.value, "GROUP");
      this.groupName =group.value;
        this.filterEmployeeList =  this.resData.map(function(employee) {
         if( employee.employeeGroup == group.value){
             return employee.employeeName;
         }
       });
    }
    
    onChangeCourse(course,template){
        if(course == 'newCourse'){
          this.openModal(template);
          this.video.courseName= null;
        }
    }

    
  fileChange(event) 
  {
    let file = event.target.files[0];
    var fileReader = new FileReader();

          fileReader.onload = function() {
            var blob = new Blob([fileReader.result], {type: file.type});
            var url = URL.createObjectURL(blob);
            var video = document.createElement('video');
            var timeupdate = function() {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
                video.pause();
              }
            };
            video.addEventListener('loadeddata', function() {
              if (snapImage()) {
                video.removeEventListener('timeupdate', timeupdate);
              }
            });
            var snapImage = function() {
              var canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
              var image = canvas.toDataURL();
              var success = image.length > 100000;
              if (success) {
                var img = document.createElement('img');
                img.src = image;
                document.getElementsByTagName('div')[0].appendChild(img);
                URL.revokeObjectURL(url);
              }
              return success;
            };
            video.addEventListener('timeupdate', timeupdate);
            video.preload = 'metadata';
            video.src = url;
            // Load video in Safari / IE11
            video.muted = true;
            // video.playsInline = true;
            video.play();
          };
          fileReader.readAsArrayBuffer(file);
  }

  createNewCourse(courseName){
      this.toastr.success('New Course created successfully');
      this.modalRef.hide();
  }


    openModal(template: TemplateRef<any>) {
                this.modalRef = this.modalService.show(template);

   }
}