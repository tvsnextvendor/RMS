import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { HeaderService, HttpService, CourseService, AlertService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

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
  @Input() CMSFilterSearchEventSet;
  @Input() uploadPage;
  constructor(private courseService: CourseService, public commonLabels : CommonLabels, public alertService: AlertService) { }

  ngOnInit() {
    this.pageLength = 5;
    this.currentPage = 1;
    this.getTrainingClassDetails();
  }

  ngDoCheck(){
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getTrainingClassDetails();
    }
  }

  getTrainingClassDetails() {

    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet);
    let newList;
    let trainList;
  this.courseService.getCourseTrainingClass(this.currentPage, this.pageLength,query).subscribe((resp) => {
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
    },err =>{
      this.CMSFilterSearchEventSet = '';
    });
  
  }

  pageChanged(e) {
    this.currentPage = e;
    this.getTrainingClassDetails();
  }

  tabChange(tabName, id, courseId,count) {
    if(count != 0 ){
      let data = {tab : tabName,id:id,courseId : courseId,isInnerTab:true}
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

}
