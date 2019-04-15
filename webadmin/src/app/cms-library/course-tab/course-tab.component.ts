import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HeaderService,HttpService,CourseService } from '../../services';
import { CmsLibraryVar } from '../../Constants/cms-library.var';

@Component({
  selector: 'app-course-tab',
  templateUrl: './course-tab.component.html',
  styleUrls: ['./course-tab.component.css']
})
export class CourseTabComponent implements OnInit {
  enableEdit = false;
  enableIndex;
  enableDuplicate = false;;
  enableView = false;
  labels;
  totalCourseCount = 0;
  courseListValue = [];
  selectedEditCourse;
  trainingClassList =[];
  selectedEditTrainingClass;
  selectedCourse = [];
  pageSize;
  p;
  total;
  constructor(private courseService : CourseService ,private cmsLibraryVar : CmsLibraryVar) { }

  @Output() SelectedcourseList = new EventEmitter<object>();

  ngOnInit() {
    this.pageSize = 10;
    this.p=1;
    this.getCourseDetails();
  }

  getCourseDetails(){
    this.courseService.getCourse(this.p,this.pageSize).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
      }
    });
  }

  enableDropData(type,index){
    console.log(type);
    if(type === "view"){
      this.enableView = this.enableIndex === index ? !this.enableView : true;
      this.enableEdit = false;
      this.enableDuplicate = false;
      this.enableIndex = index;
    }
    else if(type === "closeDuplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "closeEdit"){
      this.enableView = false;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "edit"){
      this.enableView = false;
      this.enableEdit = true;
      this.enableDuplicate = false;
      this.enableIndex = index;
      this.editCourseData(index,'');

    }
    else if(type === "duplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = true;
    }
  }

  editCourseData(index,id){
    let checkData = id ? this.courseListValue.findIndex(x=>x.courseId === parseInt(id)) : index;
    this.courseListValue.forEach((item,i)=>{
      if(i===checkData){
        this.selectedEditCourse = item.courseId;
        this.trainingClassList = item.CourseTrainingClassMaps;
        this.selectedEditTrainingClass = this.trainingClassList[0].trainingClassId;
      }
    })
  }
  pageChanged(e){
      console.log(e)
      this.p = e;
      this.getCourseDetails();
  }

  selectCourse(courseId,courseName, isChecked){
    if(isChecked){
      this.selectedCourse.push({'courseId':courseId, 'courseName': courseName});
    }else {
        let index = this.selectedCourse.indexOf(courseId);
        this.selectedCourse.splice(index,1);
      }
    this.SelectedcourseList.emit(this.selectedCourse);
  }
}

