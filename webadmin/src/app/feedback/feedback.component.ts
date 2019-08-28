import { Component, OnInit } from '@angular/core';
import { HeaderService, CommonService, UtilService, CourseService, BreadCrumbService } from '../services';
import { CommonLabels } from '../Constants/common-labels.var';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  resortData;
  resortSelected = '';
  courseSelected = '';
  trainingClassSelected = '';
  userId;
  courseData;
  trainingClassData;
  feedbackList = [];
  selectedResortApp = '';
  applicationData = [];
  resortId;
  pageSize;
  p;
  appPageSize;
  page;
  uploadPath;

  constructor(private headerService: HeaderService,
    public commonLabels: CommonLabels,
    private commonService: CommonService,
    private utilService: UtilService,
    private courseService: CourseService,
    private breadCrumbService: BreadCrumbService) {
    this.userId = this.utilService.getUserData().userId;
    this.resortId = this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
  }

  ngOnInit() {
    this.headerService.setTitle({ title: 'FeedBack', hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.pageSize = 10;
    this.p=1;
    this.appPageSize=10;
    this.page=1;
    this.commonService.getResortForFeedback(this.resortId).subscribe(result => {
      if (result && result.isSuccess) {
        this.resortData = result.data.rows.length ? result.data.rows : [];
      }
    });
    let userId = this.utilService.getUserData().userId;
    let query = '?created='+userId;
    this.courseService.getAllCourse(query).subscribe(result => {
      if (result && result.isSuccess) {
        this.courseData = result.data.rows.length ? result.data.rows : [];
      }
    });
    let currentquery = '?resortId='+this.resortId;
    this.courseService.getDropTrainingClassList(currentquery).subscribe(result => {
      if (result && result.isSuccess) {
        this.trainingClassData = result.data.rows.length ? result.data.rows : [];
      }
    });
    this.searchFilter();
    this.applicationList();
  }

  searchFilter() {
    this.feedbackList = [];
    let user = this.utilService.getUserData();
    const feedbackObj = {
      resortId: (this.resortSelected)?this.resortSelected:this.resortId,
      courseId: this.courseSelected,
      createdBy : user.userId,
      trainingClassId: this.trainingClassSelected,
      feedbackType: 'course'
    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.feedbackList = result.data && result.data.feedback.rows.length ? result.data.feedback.rows : [];
        this.uploadPath = result.data ? result.data.uploadPaths : '';
        this.clearFilter();
      } else {
        this.feedbackList = [];
      }
    });
  }

  applicationList() {
    let user = this.utilService.getUserData();
    const feedbackObj = {
      resortId: (this.selectedResortApp)?this.selectedResortApp:this.resortId,
      feedbackType: 'app',
      createdBy : user.userId

    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.applicationData = result.data && result.data.feedback.rows.length ? result.data.feedback.rows : [];
        this.clearFilter();
      } else {
        this.applicationData = [];
      }
    });
  }
  clearFilter() {
    this.selectedResortApp = '';
    this.courseSelected = '';
    this.resortSelected = '';
    this.trainingClassSelected = '';
  }

  pageChanged(e){
    this.p = e;
    this.searchFilter();
  }
  pageUpdated(e){
    this.page = e;
    this.applicationList();
  }
}
