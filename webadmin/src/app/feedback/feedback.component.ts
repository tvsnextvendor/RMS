import { Component, OnInit } from '@angular/core';
import {HeaderService, CommonService, UtilService, CourseService} from '../services';
import { CommonLabels} from '../Constants/common-labels.var';

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
  feedbackList;
  selectedResortApp = '';
  applicationData;
  constructor(private headerService: HeaderService,
    public commonLabels: CommonLabels,
    private commonService: CommonService,
    private utilService: UtilService,
    private courseService: CourseService) {
      this.userId = this.utilService.getUserData().userId;
    }

  ngOnInit() {
    this.headerService.setTitle({title: 'FeedBack', hidemodule: false});
    this.commonService.getResortList(this.userId).subscribe(result => {
      if  (result && result.isSuccess) {
        this.resortData = result.data.rows;
      }
    });
    this.courseService.getAllCourse().subscribe(result => {
      if  (result && result.isSuccess) {
        this.courseData = result.data.rows;
      }
    });
    this.courseService.getTrainingClass().subscribe(result => {
      if  (result && result.isSuccess) {
        this.trainingClassData = result.data;
      }
    });
    this.searchFilter();
    this.applicationList();
  }

  searchFilter() {
    const feedbackObj = {
      resortId : this.resortSelected,
      courseId : this.courseSelected,
      trainingClassId : this.trainingClassSelected,
      feedbackType : 'course'
    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.feedbackList = result.data;
        this.clearFilter();
      }
    });
  }

  applicationList() {
    const feedbackObj = {
      resortId : this.selectedResortApp,
      feedbackType : 'app'
    };
    this.commonService.getFeedbackList(feedbackObj).subscribe(result => {
      if (result && result.isSuccess) {
        this.applicationData = result.data;
        this.clearFilter();
      }
    });
  }

  clearFilter() {
    this.selectedResortApp = '';
    this.courseSelected = '';
    this.resortSelected = '';
    this.trainingClassSelected = '';
  }

}
