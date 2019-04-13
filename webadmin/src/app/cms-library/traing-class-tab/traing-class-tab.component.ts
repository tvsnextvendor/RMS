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
  constructor(private courseService : CourseService,private cmsLibraryVar : CmsLibraryVar) { }

  ngOnInit() {
    this.pageLength = 1;
    this.currentPage=1;
    this.getTrainingClassDetails();
  }

  getTrainingClassDetails(){
    this.courseService.getCourseTrainingClass(this.currentPage,this.pageLength).subscribe((resp)=>{
      console.log(resp);
      if(resp && resp.isSuccess){
        this.totalCourseTrainingCount = resp.data.count;
        this.trainingClassCourseList = resp.data && resp.data.rows.length && resp.data.rows;
      }
    })
  }

  pageChanged(e){
    console.log(e)
    this.currentPage = e;
    this.getTrainingClassDetails();
  }

  tabChange(tabName,id){
    console.log(tabName)
    let data = {tab : tabName,id:id}
    this.videoList.next(data);
  }

}
