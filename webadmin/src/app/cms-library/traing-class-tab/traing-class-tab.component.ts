import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService, AlertService } from '../../services';
import { CmsLibraryVar } from '../../Constants/cms-library.var';

@Component({
  selector: 'app-traing-class-tab',
  templateUrl: './traing-class-tab.component.html',
  styleUrls: ['./traing-class-tab.component.css']
})
export class TraingClassTabComponent implements OnInit {
  @Output() videoList = new EventEmitter();
  totalCourseTrainingCount = 0;
  trainingClassCourseList = [];
  pageLength;
  currentPage;
  enableEdit: boolean = false;
  enableIndex;
  editTrainingCourseId;
  TrainingList: any;
  constructor(private courseService: CourseService, public cmsLibraryVar: CmsLibraryVar, public alertService: AlertService) { }

  ngOnInit() {
    this.pageLength = 5;
    this.currentPage = 1;
    this.getTrainingClassDetails();
  }

  getTrainingClassDetails() {
    let newList;
    let trainList;
    this.courseService.getCourseTrainingClass(this.currentPage, this.pageLength).subscribe((resp) => {
      console.log(resp);
      if (resp && resp.isSuccess) {
        this.totalCourseTrainingCount = resp.data.count;
        this.trainingClassCourseList = resp.data && resp.data.rows.length ? resp.data.rows : [];
        newList = this.trainingClassCourseList.map(item => {
          let dataSet = item.CourseTrainingClassMaps;
          trainList = dataSet.map(data => {
            data.enableEdit = false;
            return data;
          });
          console.log(trainList);
        });
      }
    });
  }

  pageChanged(e) {
    console.log(e)
    this.currentPage = e;
    this.getTrainingClassDetails();
  }

  tabChange(tabName, id, courseId) {
    console.log(tabName)
    let data = {tab : tabName,id:id,courseId : courseId,isInnerTab:true}

    this.videoList.next(data);
  }
  editTrainingClassName(trainingCourseId, index, ci) {
    this.trainingClassCourseList[index].CourseTrainingClassMaps[ci].enableEdit = true;
    console.log(trainingCourseId, index);
    this.editTrainingCourseId = trainingCourseId;
    this.enableEdit = true;
  }

  saveTrainingClassName(courseName, index, ci) {
    if (courseName.form.value.trainingClassName != "") {
      console.log(courseName.form.value, "New Course Name");
      let trainingClassnamObj = {
        "trainingClassName": courseName.form.value.trainingClassName
      }
      this.courseService.updateTrainingClassName(this.editTrainingCourseId, trainingClassnamObj).subscribe((result) => {
        console.log(result);
      });
      this.trainingClassCourseList[index].CourseTrainingClassMaps[ci].enableEdit = false;
    } else {
      this.alertService.error("TrainingClass Name Mandatory");
    }

  }

}
