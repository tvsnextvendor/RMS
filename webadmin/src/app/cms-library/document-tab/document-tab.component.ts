import { Component, OnInit,Input } from '@angular/core';
import { HeaderService, HttpService, CourseService } from '../../services';

@Component({
  selector: 'app-document-tab',
  templateUrl: './document-tab.component.html',
  styleUrls: ['./document-tab.component.css']
})
export class DocumentTabComponent implements OnInit {
  @Input() documentId;
 



  totalVideosCount = 0;
  videoListValue;
  addVideosToCourse = false;
  page;
  pageSize;
  

  constructor(private courseService: CourseService) { 
    this.pageSize = 3;
    this.page=1;

  }

  ngOnInit(){
    console.log(this.documentId)
    this.getCourseFileDetails();
  }
  getCourseFileDetails() {
    this.courseService.getFiles('Document',this.page,this.pageSize).subscribe(resp => {
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
    this.page = e;
    this.getCourseFileDetails();
  }

}
