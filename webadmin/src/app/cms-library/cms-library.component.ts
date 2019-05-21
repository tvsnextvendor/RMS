import { Component, OnInit, TemplateRef,Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, HttpService, AlertService, FileService } from '../services';
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
  constructor(private modalService: BsModalService,public fileService: FileService,public commonLabels : CommonLabels, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
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
  selectedVideoList=[];
  showcreatecourse=false;
  findCreateCourse;
  notificationValue;
  notifyType;
  enableNotify = false;


  ngOnInit() {
    
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.selectedTab = 'course';
    this.quizTabHit = false;
    this.notifyType = 'assignedToCourse';
  }

  openEditModal(template: TemplateRef<any>,modelValue) {
    this.showWarning = false;
    let modalConfig  = {class : "modal-xl"};
    if(this.selectedCourse.length > 0){
    this.modalRef = this.modalService.show(template,modalConfig);
    }else{
    this.showWarning =true;
    let self = this;
    setTimeout(function(){ 
     self.showWarning = false;
     }, 5000);
    }
  }

  showUploadPage(event){
     this.findCreateCourse = event.key ? true : false;
    if(event){
      this.hideSection= true;
      this.selectedTab = 'video';
      this.showcreatecourse = false;
    }
  }

  goTocmsLibrary(){
    this.hideSection = false;
    this.enableNotify = false;
     this.selectedTab = 'course';
  }

  showCreateCourse(){
    this.showcreatecourse = true;
    this.hideSection= true;
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
    else if (key != 'trainingfiles'){
      this.courseId = '';
    }
    else{
      this.quizTabHit = false; 
    }
  }
 
  completed(event){
    let keysToRemove = ["index", "type"];
     keysToRemove.forEach(element => {
        localStorage.removeItem(element);
     });
    this.selectedVideoList=[];
    this.hideSection=false;
    this.showcreatecourse=false;
    this.enableNotify = false;
    this.selectedTab = 'course';
  }

  redirectTab(value){
    this.trainingClassId = '';
    this.courseId = '';
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
  
  sendFilesToCourse(){
    this.selectedVideoList = this.fileService.selectedFiles();
    if(this.findCreateCourse){
       this.showCreateCourse();
    }else{
      this.hideSection= false;
      this.selectedTab = 'course';
     }
  }

  openCreateModal(template: TemplateRef<any>,modelValue) {
    this.notifyType = 'assignedToCourse';
    let modalConfig=  {
      class : "modal-lg modal-dialog-centered"
    }
    this.modalRef = this.modalService.show(template,modalConfig);
  }

  closeModal(){
    this.enableNotify = false;
    this.modalRef.hide();
  }

  notificationType(){
    
    // let modalConfig={
    //   class : "notification-modal"
    // }
    // console.log(this.notifyType)
  this.enableNotify = true;
  this.notificationValue = this.notifyType;
  this.modalRef.hide();
  // this.modalRef = this.modalService.show(template,modalConfig);
}

notificationTypeUpdate(type){
  this.notifyType = type;
}

   
}
