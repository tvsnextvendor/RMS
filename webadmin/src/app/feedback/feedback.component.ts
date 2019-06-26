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
        this.resortData = result.data.rows;
      }
    });
    let userId = this.utilService.getUserData().userId;
    let query = '?created='+userId;
    this.courseService.getAllCourse(query).subscribe(result => {
      if (result && result.isSuccess) {
        this.courseData = result.data.rows;
      }
    });
    this.courseService.getTrainingClass().subscribe(result => {
      if (result && result.isSuccess) {
        this.trainingClassData = result.data;
      }
    });
    this.searchFilter();
    this.applicationList();
  }

  searchFilter() {
    this.feedbackList = [];
    const feedbackObj = {
      resortId: this.resortSelected,
      courseId: this.courseSelected,
      trainingClassId: this.trainingClassSelected,
      feedbackType: 'course'
    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.feedbackList = result.data;
        this.clearFilter();
      } else {
        this.feedbackList = [];
      }
    });
  }

  applicationList() {
    const feedbackObj = {
      resortId: this.selectedResortApp,
      feedbackType: 'app'
    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.applicationData = result.data;
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
