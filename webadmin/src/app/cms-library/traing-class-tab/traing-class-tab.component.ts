import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HeaderService, HttpService, CourseService, AlertService, UtilService, BreadCrumbService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

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
  @Input() CMSFilterSearchEventSet;
  @Input() uploadPage;
  @Input() courseId;
  constructor(private courseService: CourseService, public commonLabels: CommonLabels, public alertService: AlertService, private utilService: UtilService, private breadCrumbService: BreadCrumbService, private route: Router) { }

  ngOnInit() {
    this.pageLength = 10;
    this.currentPage = 1;
    this.userData = this.utilService.getUserData().userId;
    let roleId = this.utilService.getRole();
    let resourceLib = false;
    if (window.location.pathname.indexOf("resource") != -1) {
      let data = [{ title: this.commonLabels.labels.resourceLibrary, url: '/resource/library' }, { title: this.commonLabels.labels.trainingClass, url: '' }];
      this.breadCrumbService.setTitle(data);
      resourceLib = true;
    } else {
      let data = [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.trainingClass, url: '' }]
      this.breadCrumbService.setTitle(data);
      this.enableClassEdit = true;
    }

    if(roleId == 4 && resourceLib){
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
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet) : (roleId != 1 ? (this.courseId ? '&courseId=' + this.courseId + '&resortId=' + resortId : '&resortId=' + resortId) : '');
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
        console.log(result);
      });
      this.trainingClassCourseList[index].CourseTrainingClassMaps[ci].enableEdit = false;
    } else {
      this.alertService.error(this.commonLabels.mandatoryLabels.courseNameError);
    }
  }
  editTrainingClass(data, i) {
    this.route.navigate(['/cms-library'], { queryParams: { type: 'create', tab: 'class', classId: data.trainingClassId } })
  }
}
