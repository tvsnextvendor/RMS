import { Component, OnInit, TemplateRef,Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, HttpService, AlertService } from '../services';
import { ToastrService } from 'ngx-toastr';
// import { TraingClassTabComponent } from './traing-class-tab/traing-class-tab.component'
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../Constants/common-labels.var';


@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {
  constructor(private modalService: BsModalService,private commonLabels : CommonLabels, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
  modalRef;
  videoFile;
  selectedTab;
  redirectId;
  selectedCourse =[];
  showWarning=false;
  hideSection=false;
  trainingClassId;
  courseId;
  CMSFilterSearchEvent;
  quizTabHit;
  selectedVideoList;


  ngOnInit() {
    
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.selectedTab = 'course';
    this.quizTabHit = false;
  }

  openEditModal(template: TemplateRef<any>,modelValue) {
    this.showWarning = false;
    let modalConfig  = {class : "modal-xl"};
    if(this.selectedCourse.length > 0){
    this.modalRef = this.modalService.show(template,modalConfig);
    }else{
    this.showWarning =true;
    }
  }

  showUploadPage(event){
    if(event){
      this.hideSection= true;
      this.selectedTab = 'training'
    }
  }

  headerTabChange(title,key){
    this.selectedTab = title;
    if(key != 'trainingfiles' && (title == 'video' || title == 'document')){
      this.trainingClassId = '';
      this.quizTabHit = false;
    }
    else if(key != 'trainingfiles' && title == 'quiz'){
      this.quizTabHit = true;
    }
    else{
      this.quizTabHit = false; 
    }
  }

  redirectTab(value){
    if(value){
      this.trainingClassId = value.id;
    }
    this.courseId = value.courseId;
    this.headerTabChange(value.tab,'trainingfiles');
  }
  
  getCourse(event){
    this.selectedCourse=event;
  }

  hidePopup(type){
    this.modalRef.hide();
    if(type !== 'cancel'){
      // window.location.reload();
      this.selectedCourse = [];
    } 
  }

  receivefilterMessage($event) {
    this.CMSFilterSearchEvent = $event;
    //this.headerTabChange('course','');
   }

   getVideos(event){
     this.selectedVideoList = event;
     this.hideSection= false;
     this.selectedTab = 'course';
   }
}
