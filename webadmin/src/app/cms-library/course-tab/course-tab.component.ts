import { Component, OnInit } from '@angular/core';
import { HeaderService,HttpService } from '../../services';
import { CourseService } from '../../services/restservices/course.service';

@Component({
  selector: 'app-course-tab',
  templateUrl: './course-tab.component.html',
  styleUrls: ['./course-tab.component.css']
})
export class CourseTabComponent implements OnInit {
  enableEdit = false;
  enableDuplicate = false;;
  enableView = false;

  constructor(private courseService : CourseService) { }

  ngOnInit() {
    this.courseService.getCourse().subscribe(resp=>{
      console.log(resp);
    });
  }

  enableDropData(type){
    console.log(type);
    if(type === "view"){
      this.enableView = !this.enableView;
      this.enableEdit = false;
      this.enableDuplicate = false;
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

    }
    else if(type === "duplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = true;
    }
  }

}
