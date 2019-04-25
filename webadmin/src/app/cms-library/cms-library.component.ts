import { Component, OnInit, TemplateRef,Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService, HttpService, AlertService } from '../services';
import { ToastrService } from 'ngx-toastr';
// import { TraingClassTabComponent } from './traing-class-tab/traing-class-tab.component'
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {
  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
  modalRef;
  videoFile;
  selectedTab;
  redirectId;
  selectedCourse =[];
  showWarning=false;
  trainingClassId;
  courseId;
  CMSFilterSearchEvent;
  
 
  // @Output() CMSFilterSearchEvent = new EventEmitter<string>();

  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.selectedTab = 'course';
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

  headerTabChange(title,key){
    this.selectedTab = title;
    if(key != 'trainingfiles'){
      this.trainingClassId = '';
    }
  }

  redirectTab(value){
    if(value && (value.tab == 'video' || value.tab == 'document') ){
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
    console.log(type)
    if(type !== 'cancel'){
      // window.location.reload();
      this.selectedCourse = [];
    } 
  }

  receivefilterMessage($event) {
    console.log("CMS Library search options receive");
    console.log($event);
    this.CMSFilterSearchEvent = $event;
    //this.headerTabChange('course','');
   }
}
