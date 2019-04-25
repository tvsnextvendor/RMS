import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { HeaderService,HttpService,CourseService } from '../../services';
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
  constructor(private courseService : CourseService,public cmsLibraryVar : CmsLibraryVar) { }

  ngOnInit() {
    this.pageLength = 5;
    this.currentPage=1;
    this.getTrainingClassDetails();
  }

  getTrainingClassDetails(){
    this.courseService.getCourseTrainingClass(this.currentPage,this.pageLength).subscribe((resp)=>{
      console.log(resp);
      if(resp && resp.isSuccess){
        this.totalCourseTrainingCount = resp.data.count;
        this.trainingClassCourseList = resp.data && resp.data.rows.length  ? resp.data.rows : [];
      }
    })
  }

  pageChanged(e){
    console.log(e)
    this.currentPage = e;
    this.getTrainingClassDetails();
  }

  tabChange(tabName,id,courseId){
    console.log(tabName)
    let data = {tab : tabName,id:id,courseId : courseId,isInnerTab:true}
    this.videoList.next(data);
  }

}
