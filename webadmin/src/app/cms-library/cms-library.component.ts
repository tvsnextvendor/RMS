import { Component, OnInit, OnDestroy, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, AlertService, FileService } from '../services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../Constants/common-labels.var';


@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit, OnDestroy {
  constructor(
    private modalService: BsModalService,
    public fileService: FileService,
    public commonLabels: CommonLabels,
    private alertService: AlertService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService) {
  }
  modalRef;
  videoFile;
  selectedTab;
  redirectId;
  selectedCourse = [];
  showWarning = false;
  hideSection = false;
  trainingClassId;
  courseId;
  resourceLibrary = false;
  CMSFilterSearchEvent;
  quizTabHit;
  deselectAll = false;
  selectedVideoList = [];
  showcreatecourse = false;
  findCreateCourse;
  notificationValue;
  notifyType;
  tabName;
  enableNotify = false;
  enableBatch = false;
  disableEdit = false;
  disableTabs = false;
  schedulePage = false;
  resourceLib = false;
  filterUpdate = false;
  classView = 'course';

  ngOnInit() {
    this.selectedTab = 'course';
    this.quizTabHit = false;
    this.notifyType = 'assignedToCourse';
    this.activatedRoute.queryParams.subscribe(params => {

      this.fileService.setCurrentCompname(params.tab);
      if (params.type && params.type == 'create') {
        this.disableEdit = false;
        this.disableTabs = false;
        this.schedulePage = false;
        switch (params.tab) {
          case 'course':
            this.showcreatecourse = true;
            this.enableNotify = false;
            this.tabName = params.tab;
            this.fileService.emptyFileList();
            break;
          case 'class':
            this.showcreatecourse = true;
            this.enableNotify = false;
            this.tabName = params.tab;
            this.fileService.emptyFileList();
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
            this.schedulePage = true;
            break;
        }
      }
      else if (params.type && params.type == 'edit') {
        this.disableEdit = false;
        this.showcreatecourse = false;
        this.hideSection = false;
        this.enableNotify = false;
        this.enableBatch = false;
        this.disableTabs = false;
        switch (params.tab) {
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
          case 'video':
            this.selectedTab = 'video';
            break;
          case 'document':
            this.selectedTab = 'document';
            break;
          case 'workInprogress':
            this.selectedTab = 'workInprogress';
            break;
        }
      }
      else if (!Object.keys(params).length) {
        this.selectedTab = 'course';
        this.showcreatecourse = false;
        this.enableNotify = false;
        this.enableBatch = false;
        this.disableEdit = true;
        this.disableTabs = false;
      }
      if (params.tab == 'schedule') {
        this.headerService.setTitle({ title: this.commonLabels.labels.schedule, hidemodule: false });
      } else if (window.location.pathname.indexOf("resource") != -1) {
        this.resourceLib = true;
        this.headerService.setTitle({ title: this.commonLabels.labels.resourceLibrary, hidemodule: false });
      } else {
        let path = window.location.pathname;
        let data = params.type == 'create' ? 'Create' : params.type == 'edit' ? 'Edit' : path == '/LMS/cms-library' ? 'Edit' : 'Create';
       // let topTitle = (!this.resourceLibrary) ? 'Resource Library' : data;
        // alert(this.resourceLibrary);
        // alert(topTitle);
        this.headerService.setTitle({ title: data, hidemodule: false });
      }
    })
  }

  openEditModal(template: TemplateRef<any>, modelValue) {
    this.showWarning = false;
    let modalConfig = { class: "modal-xl" };
    if (this.selectedCourse.length > 0) {
      this.modalRef = this.modalService.show(template, modalConfig);
    } else {
      this.showWarning = true;
      let self = this;
      setTimeout(function () {
        self.showWarning = false;
      }, 5000);
    }
  }

  showUploadPage(event) {
    this.findCreateCourse = event.key ? true : false;
    if (event) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params && params.type == 'edit') {
          this.resourceLibrary = true;
        }
      });
      this.hideSection = true;
      this.selectedTab = 'video';
      this.showcreatecourse = false;
    }
  }

  goTocmsLibrary() {
    this.hideSection = false;
    this.enableNotify = false;
    this.enableBatch = false;
    this.selectedTab = 'course';
  }

  showCreateCourse() {
    this.showcreatecourse = true;
    this.hideSection = true;
  }

  headerTabChange(title, key) {
    window.scroll(0,0);
    this.selectedTab = title;
    if(this.selectedTab){
      this.filterUpdate = true;
    }
    else{
      this.filterUpdate = false;
    }
    if (key != 'trainingfiles' && (title == 'video' || title == 'document')) {
      this.trainingClassId = '';
      this.quizTabHit = false;
    }
    else if (key != 'trainingfiles' && title == 'quiz') {
      this.quizTabHit = true;
    }
    else if (key != 'trainingfiles') {
      this.courseId = '';
    }
    else {
      this.quizTabHit = false;
    }
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.type == 'edit' && !this.resourceLibrary) {
        title = (title == 'training') ? 'class' : title;
        this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: title } })
      }
    });
  }
  completed(event) {
    if (event == 'back') {
      this.route.navigate(['/cmspage']);
    } else {
      let keysToRemove = ["index", "type"];
      keysToRemove.forEach(element => {
        localStorage.removeItem(element);
      });
      this.selectedVideoList = [];
      this.hideSection = false;
      this.showcreatecourse = false;
      this.enableNotify = false;
      this.enableBatch = false;
      this.selectedTab = 'course';
      this.selectedCourse = [];
    }
  }

  redirectTab(value) {
    this.trainingClassId = '';
    this.courseId = '';
    if (value) {
      this.trainingClassId = value.id;
    }
    this.courseId = value.courseId;
    this.headerTabChange(value.tab, 'trainingfiles');
  }

  getCourse(event) {
    // console.log(event);
    this.selectedCourse = event;
  }

  hidePopup(type) {
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

  sendFilesToCourse() {
    this.fileService.saveFileList();
    this.selectedVideoList = this.fileService.selectedFiles();
    if (this.selectedVideoList.length) {
      if (this.findCreateCourse) {
        this.showCreateCourse();
      } else {
        this.hideSection = false;
        this.selectedTab = 'course';
      }
    }
    else {
      this.alertService.error("Please select add minimum one file")
    }
  }

  openCreateModal(template: TemplateRef<any>, modelValue) {
    this.notifyType = 'assignedToCourse';
    let modalConfig = {
      class: "modal-lg modal-dialog-centered"
    }
    this.modalRef = this.modalService.show(template, modalConfig);
  }

  closeModal() {
    this.enableNotify = false;
    this.modalRef.hide();
  }

  notificationType() {
    // let modalConfig={
    //   class : "notification-modal"
    // }
    // console.log(this.notifyType)
    this.enableNotify = true;
    this.notificationValue = this.notifyType;
    this.modalRef.hide();
    // this.modalRef = this.modalService.show(template,modalConfig);
  }

  notificationTypeUpdate(type) {
    this.notifyType = type;
  }

  enableData(data, type) {
    if (this.selectedCourse.length > 0) {
      this.enableBatch = true;
    } else {
      this.showWarning = true;
      let self = this;
      setTimeout(function () {
        self.showWarning = false;
      }, 5000);
    }
  }

  backClicked() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type == 'create') {
        this.tabName = params.tab && params.tab == 'class' ? 'class' : 'course';
        this.hideSection = true;
        this.showcreatecourse = true;
        // sendFileList
        this.fileService.emptyLocalFileList();
      } else if (params.type == 'edit' || this.resourceLib) {
        this.selectedTab = 'course';
        this.hideSection = false;
        this.showcreatecourse = false;
        this.fileService.emptyLocalFileList();
      }
    })
  }

  classViewUpdate(data){
    this.classView = data;
  }

  ngOnDestroy() {
    this.resourceLib = false;
  }
}
