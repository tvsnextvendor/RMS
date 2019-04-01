import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css'],
})

export class ModuleListComponent implements OnInit {

  textContent;
  message: string = '';
  moduleAdd = false;
  modalRef: BsModalRef;

  description;
  videoFile;
  videoName;
  videoSubmitted = false;
  showImage = false;
  uploadFile;
  fileUrl;
  fileType;
  previewImage;
  videoIndex;
  courseId;

  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public moduleVar: ModuleVar, private toastr: ToastrService, private headerService: HeaderService) {
    this.moduleVar.url = API_URL.URLS;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['id']; 
  });
  }

  ngOnInit() {
    this.moduleVar.title = "Courses";
    this.headerService.setTitle({ title: this.moduleVar.title, hidemodule: false });
    this.moduleVar.moduleList = [];
    this.http.get(this.moduleVar.url.ProgramModuleList).subscribe((data) => {
      let courseData;
      if(data && data.programDetails && data.programDetails.length){
        courseData = data.programDetails.find(x=>x.programId == this.courseId);   
      }
      this.moduleVar.moduleList.push(courseData);
    });
  }


  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      307: {
        items: 2
      },
      614: {
        items: 3
      },
      921: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  }

  //To change Activate/Deactive module status.
  statusUpdate(moduleName, status) {
    let statusName = status ? this.moduleVar.labels.activeMsg : this.moduleVar.labels.deactiveMsg;
    // this.toastr.success(moduleName + statusName);
    this.alertService.success(moduleName + statusName);
  }

  messageClose() {
    this.message = '';
    // console.log("messege redsad")
  }

  moduleEdit(data, i) {
    this.moduleAdd = true;
    this.route.navigateByUrl('/module/' + data.programId)
  }


  openModal(template: TemplateRef<any>, data, type, index) {
    console.log(template);
    if (type === "video") {
      this.moduleVar.videoLink = data;
      this.modalRef = this.modalService.show(template);
    }
    else {
      this.showImage = true;
      this.fileType = data.fileType;
      this.videoName = data.fileName;
      this.videoFile = data.fileUrl;
      console.log(this.videoFile.substring(this.videoFile.lastIndexOf('/') + 1));
      this.description = data.fileDescription;
      this.previewImage = data.videoImage;
      this.videoIndex = index;
      this.modalRef = this.modalService.show(template);
    }
  }

  cancelVideoSubmit() {
    this.modalRef.hide();
    this.videoName = '';
    this.videoFile = '';
    this.description = '';
    this.showImage = false;
    this.showImage = false;
  }

  videoSubmit() {
    this.videoSubmitted = true;
    if (this.videoName && this.videoFile && this.description) {
      let i = this.videoIndex;
      let postData = {
        'fileName': this.videoName,
        'fileUrl': this.videoFile,
        'fileDescription': this.description
      }
      // this.moduleVar.selectedCourse.videos[i].videoTitle = this.videoName;
      // this.moduleVar.selectedCourse.videos[i].videoLink = this.videoFile;
      // this.moduleVar.selectedCourse.videos[i].videoDescription = this.description;
      this.modalRef.hide();
      this.message = "Video updated successfully"
      this.alertService.success(this.message);
    }
    else {
      console.log("video submitted error");
    }
  }


  fileUpload(e) {
    this.showImage = true;
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.uploadFile = file;
      this.fileUrl = reader.result;
    }
    reader.readAsDataURL(file)
    this.previewImage = "assets/videos/images/bunny.png";
  }


}
