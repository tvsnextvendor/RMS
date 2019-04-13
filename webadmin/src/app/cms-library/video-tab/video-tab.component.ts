import { Component, OnInit ,Input} from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';

@Component({
  selector: 'app-video-tab',
  templateUrl: './video-tab.component.html',
  styleUrls: ['./video-tab.component.css']
})
export class VideoTabComponent implements OnInit {
  @Input() videoId;
  totalVideosCount;
  videoListValue;
  addVideosToCourse = false;
  p;
  pageSize;
  

  constructor(private courseService: CourseService) { 
    this.pageSize = 3;
    this.p=1;

  }

  ngOnInit(){
    console.log(this.videoId)
    this.getCourseFileDetails();
  }
  getCourseFileDetails() {
    this.courseService.getFiles('Video').subscribe(resp => {
      console.log(resp);
      if (resp && resp.isSuccess) {
        this.totalVideosCount = resp.data.count;
        this.videoListValue = resp.data && resp.data.rows.length && resp.data.rows;
      }
    });
  }
  openAddVideosToCourse(){
   
    this.addVideosToCourse = !this.addVideosToCourse;
  }
  pageChanged(e){
    console.log(e)
    this.p = e;
  }
}
