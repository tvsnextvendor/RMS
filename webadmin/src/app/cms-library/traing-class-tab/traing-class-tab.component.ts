import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
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
  @Input() CMSFilterSearchEventSet;
  constructor(private courseService: CourseService, public cmsLibraryVar: CmsLibraryVar, public alertService: AlertService) { }

  ngOnInit() {
    this.pageLength = 5;
    this.currentPage = 1;
    this.getTrainingClassDetails();
  }

  ngDoCheck(){
    console.log("this.CMSFilterSearchEventSet");
    console.log(this.CMSFilterSearchEventSet);
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== ''){
      this.getTrainingClassDetails();
    }
  }

  getTrainingClassDetails() {

    let query = '';
    if(this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '')
    {
      let courseId           = (this.CMSFilterSearchEventSet.courseId)?this.CMSFilterSearchEventSet.courseId:'';
      let trainingClassId    = (this.CMSFilterSearchEventSet.trainingClassId)?this.CMSFilterSearchEventSet.trainingClassId:'';
      let divisionId         = (this.CMSFilterSearchEventSet.parentDivisionId)?this.CMSFilterSearchEventSet.parentDivisionId:((this.CMSFilterSearchEventSet.childDivisionId)?this.CMSFilterSearchEventSet.childDivisionId:'');
      let departmentId       = (this.CMSFilterSearchEventSet.parentDepartmentId)?this.CMSFilterSearchEventSet.parentDepartmentId:((this.CMSFilterSearchEventSet.childDepartmentId)?this.CMSFilterSearchEventSet.childDepartmentId:'');
      let subResortId        = (this.CMSFilterSearchEventSet.childResortId)?this.CMSFilterSearchEventSet.childResortId:'';
      let createdBy          = (this.CMSFilterSearchEventSet.createdBy)?this.CMSFilterSearchEventSet.createdBy:'';
      let search             = (this.CMSFilterSearchEventSet.search)?this.CMSFilterSearchEventSet.search:''

      courseId=  (courseId == 'null')?'':courseId;
      trainingClassId = (trainingClassId == 'null')?'':trainingClassId;
      divisionId= (divisionId == 'null')?'':divisionId;
      departmentId= (departmentId == 'null')?'':departmentId;
      subResortId=   (subResortId == 'null')?'':subResortId;
      createdBy =(createdBy == 'null')?'':createdBy;
      query = '&courseId='+courseId+'&trainingClassId='+trainingClassId+'&subResortId='+subResortId+'&divisionId='+divisionId+'&departmentId='+departmentId+'&createdBy='+createdBy+'&search='+search;

    }
    console.log("query");
    console.log(query);
    let newList;
    let trainList;
  this.courseService.getCourseTrainingClass(this.currentPage, this.pageLength,query).subscribe((resp) => {
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
    this.CMSFilterSearchEventSet = '';
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
