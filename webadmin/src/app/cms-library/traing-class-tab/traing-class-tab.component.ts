import { Component, OnInit, Input, Output, EventEmitter ,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService, HttpService, CourseService, AlertService, UtilService, BreadCrumbService ,PermissionService} from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-traing-class-tab',
  templateUrl: './traing-class-tab.component.html',
  styleUrls: ['./traing-class-tab.component.css']
})
export class TraingClassTabComponent implements OnInit {
  @Output() videoList = new EventEmitter();
  @Input() disableEdit;
  @Input() disableTabs;
  totalCourseTrainingCount = 0;
  trainingClassCourseList = [];
  pageLength;
  currentPage;
  enableEdit: boolean = false;
  enableIndex;
  enableClassEdit = false;
  editTrainingCourseId;
  TrainingList: any;
  userData;
  iconEnable = true;
  schedulePage = false;
  @Input() CMSFilterSearchEventSet;
  @Input() uploadPage;
  @Input() courseId;
  resourceLib;
  selectedClass;
  modalRef;
  roleId;

  constructor(private courseService: CourseService,
     public commonLabels: CommonLabels,
      public alertService: AlertService, 
      private utilService: UtilService, 
      private breadCrumbService: BreadCrumbService,
      private activatedRoute: ActivatedRoute,
       private route: Router,
       private modalService: BsModalService,
       private permissionService : PermissionService 
      ) { }

  ngOnInit() {
    this.pageLength = 10;
    this.currentPage = 1;
    this.userData = this.utilService.getUserData().userId;
    this.roleId = this.utilService.getRole();
    this.resourceLib = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.tab == 'schedule') {
        this.schedulePage = true;
      }
    });
    if (window.location.pathname.indexOf("resource") != -1) {
      let data = [{ title: this.commonLabels.labels.resourceLibrary, url: '/resource/library' }, { title: this.commonLabels.labels.trainingClass, url: '' }];
      this.breadCrumbService.setTitle(data);
      this.resourceLib = true;
    } else {
      let data = [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.trainingClass, url: '' }]
      this.breadCrumbService.setTitle(data);
      this.enableClassEdit = true;
    }

    if(this.roleId == 4 && this.resourceLib || !this.permissionService.editPermissionCheck('Training Class')){
      this.iconEnable = false;
    }
    if (this.enableClassEdit) {
      this.getTrainingClassList();
    }
    else {
      this.getTrainingClassDetails();
    }

  }

  ngDoCheck() {
    if (this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '') {
      if (this.enableClassEdit) {
        this.getTrainingClassList();
      }
      else {
        this.getTrainingClassDetails();
      }
    }
  }

  getTrainingClassList() {
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? 
                  (roleId != 1 ? this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&resortId='+resortId  : this.courseService.searchQuery(this.CMSFilterSearchEventSet)) : 
                    (roleId != 1 ? (this.courseId ? '&courseId=' + this.courseId + '&resortId=' + resortId : '&resortId=' + resortId+"&createdBy="+user.userId) : '');
    if(roleId == 4 ){
      query = this.resourceLib ? (query+"&draft=false") : (query+"&draft=true");
    }
    this.courseService.getTrainingClassList(this.currentPage,this.pageLength,query).subscribe(resp => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalCourseTrainingCount = resp.data.count;
        this.trainingClassCourseList = (resp.data && resp.data.count > 0) ? resp.data.rows && resp.data.rows.length && resp.data.rows : [];
      }
    }, err => {
      this.CMSFilterSearchEventSet = '';
    })
  }

  getTrainingClassDetails() {
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : (roleId != 1 ? (this.courseId ? '&courseId=' + this.courseId + '&resortId=' + resortId : '&resortId=' + resortId) : '');
    // let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : this.courseId ? '&courseId='+this.courseId : '';
    // console.log(query)
    // debugger;
    if(roleId == 4 ){
      query = this.resourceLib ? (query+"&draft=false") : (query+"&draft=true");
    }
    let newList;
    let trainList;
    this.courseService.getCourseTrainingClass(this.currentPage, this.pageLength, query).subscribe((resp) => {
      this.CMSFilterSearchEventSet = '';
      if (resp && resp.isSuccess) {
        this.totalCourseTrainingCount = resp.data.count;
        this.trainingClassCourseList = resp.data && resp.data.rows.length ? resp.data.rows : [];
        newList = this.trainingClassCourseList.map(item => {
          let dataSet = item.CourseTrainingClassMaps;
          trainList = dataSet.map(data => {
            data.enableEdit = false;
            return data;
          });
        });
      }
    }, err => {
      this.CMSFilterSearchEventSet = '';
    });
  }

  pageChanged(e) {
    this.currentPage = e;
    if (this.enableClassEdit) {
      this.getTrainingClassList();
    }
    else {
      this.getTrainingClassDetails();
    }
  }

  tabChange(tabName, id, courseId, count) {
    if (count != 0) {
      let data = { tab: tabName, id: id, courseId: courseId, isInnerTab: true }
      this.videoList.next(data);
    }
  }
  editTrainingClassName(trainingCourseId, index, ci) {
    this.trainingClassCourseList[index].CourseTrainingClassMaps[ci].enableEdit = true;
    this.editTrainingCourseId = trainingCourseId;
    this.enableEdit = true;
  }
  saveTrainingClassName(courseName, index, ci) {
    if (courseName.form.value.trainingClassName != "") {
      let trainingClassnamObj = {
        "trainingClassName": courseName.form.value.trainingClassName
      }
      this.courseService.updateTrainingClassName(this.editTrainingCourseId, trainingClassnamObj).subscribe((result) => {
      });
      this.trainingClassCourseList[index].CourseTrainingClassMaps[ci].enableEdit = false;
    } else {
      this.alertService.error(this.commonLabels.mandatoryLabels.courseNameError);
    }
  }
  editTrainingClass(data, i) {
    this.route.navigate(['/cms-library'], { queryParams: { type: 'create', tab: 'class', classId: data.trainingClassId } })
  }
  approvalConfirmation(template: TemplateRef<any>, courses) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.selectedClass = courses;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  sendApproval() {
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    let resortId = userData.ResortUserMappings[0].Resort.resortId
    let approvalData = {
      'contentName': this.selectedClass.trainingClassName,
      'contentId': this.selectedClass.trainingClassId,
      'contentType': 'Training Class',
      'resortId': resortId,
      'createdBy': userId,
      'reportingTo': userData.reportingTo
    };
    this.courseService.sendApproval(approvalData).subscribe(result => {
      this.modalRef.hide();
      if (result && result.isSuccess) {
        // this.alertService.success(result.message);
        setTimeout(()=>{
          this.alertService.success(result.message);
        },300); 
      } else {
        // this.alertService.error(result.message);
        setTimeout(()=>{
          this.alertService.error(result.message);
        },300); 
      }
    }, (errorRes) => {
      this.modalRef.hide();
      setTimeout(()=>{
        this.alertService.error(errorRes.error.error);
      },300); 
    });
  }
}
