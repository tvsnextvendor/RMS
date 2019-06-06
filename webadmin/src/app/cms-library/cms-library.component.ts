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
  constructor(
    private modalService: BsModalService,
    public fileService: FileService,
    public commonLabels : CommonLabels, 
    // private http: HttpService,
    private alertService: AlertService,
    private route: Router, 
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService) { }

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
  deselectAll= false;
  selectedVideoList=[];
  showcreatecourse=false;
  findCreateCourse;
  notificationValue;
  notifyType;
  tabName;
  enableNotify = false;
  enableBatch = false;
  disableEdit = false;
  disableTabs = false;


  ngOnInit() {
  this.selectedTab = 'course';
  this.quizTabHit = false;
  this.notifyType = 'assignedToCourse';
  this.activatedRoute.queryParams.subscribe(params=>{
    if(params.type && params.type == 'create'){
      this.disableEdit = false;
      this.disableTabs = false;
              console.log(params.tab,"Params")
      switch(params.tab){
        case 'course':
          this.showcreatecourse = true;
          this.enableNotify = false;
          this.tabName=params.tab;
          break;
        case 'class':
          this.showcreatecourse = true;
          this.enableNotify = false;
          this.tabName=params.tab;
          break;  
        case 'quiz':
        break;
        case 'notification':
        this.showcreatecourse = false;
        this.enableNotify = true;
        break;  
        case 'schedule':
        this.disableTabs = true;
        this.disableEdit = true;
        break;
      }
    }
    else if(params.type && params.type == 'edit'){
      this.disableEdit = false;
      this.showcreatecourse = false;
      this.enableNotify = false;
      this.enableBatch = false;
      this.disableTabs = false;
      switch(params.tab){
        case 'class':
        this.selectedTab = 'training';
        break;
        case 'course':
        this.selectedTab = 'course';
        break;
        case 'quiz':
        this.selectedTab = 'quiz';
        this.quizTabHit = true;
        break;
        case 'notification':
        this.selectedTab = 'notification';
        break;
        case 'workInprogress':
        this.selectedTab = 'workInprogress';
        break;
      }
    }
    else if(!Object.keys(params).length){
      this.selectedTab = 'course';
      this.showcreatecourse = false;
      this.enableNotify = false;
      this.enableBatch = false;
      this.disableEdit = true;
      this.disableTabs = false;
    }
  })
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
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
    this.enableBatch = false;
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
    if(event == 'back'){
      this.route.navigate(['/cmspage']);
    }else{
      let keysToRemove = ["index", "type"];
      keysToRemove.forEach(element => {
          localStorage.removeItem(element);
      });
      this.selectedVideoList=[];
      this.hideSection=false;
      this.showcreatecourse=false;
      this.enableNotify = false;
      this.enableBatch = false;
      this.selectedTab = 'course';
      this.selectedCourse = [];
    }
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
    console.log(event);
    this.selectedCourse=event;
  }

  hidePopup(type){
    this.deselectAll = true;
    this.modalRef.hide();
    //if(type !== 'cancel'){
      this.selectedCourse = [];
    //} 
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

enableData(data,type){
  // console.log(data)  
  if(this.selectedCourse.length > 0){
    this.enableBatch = true;
  }else{
  this.showWarning =true;
  let self = this;
  setTimeout(function(){ 
    self.showWarning = false;
    }, 5000);
  }
}

   
}
