import { Component, OnInit } from '@angular/core';
import { HeaderService,HttpService } from '../../services';
import { CourseService } from '../../services/restservices/course.service';
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
  courseList = [];
  selectedEditCourse;
  trainingClassList =[];
  selectedEditTrainingClass;
  constructor(private courseService : CourseService ,private cmsLibraryVar : CmsLibraryVar) { }

  ngOnInit() {
    this.getCourseDetails();
  }

  getCourseDetails(){
    this.courseService.getCourse().subscribe(resp=>{
      console.log(resp);
      if(resp && resp.isSuccess){
        this.totalCourseCount = resp.data.count;
        this.courseList = resp.data && resp.data.rows.length && resp.data.rows;
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
    let checkData = id ? this.courseList.findIndex(x=>x.courseId === parseInt(id)) : index;
    this.courseList.forEach((item,i)=>{
      if(i===checkData){
        this.selectedEditCourse = item.courseId;
        this.trainingClassList = item.CourseTrainingClassMaps;
        this.selectedEditTrainingClass = this.trainingClassList[0].trainingClassId;
      }
    })
  }

}
