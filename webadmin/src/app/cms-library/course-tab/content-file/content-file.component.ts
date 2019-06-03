import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params } from '@angular/router';
import {CourseService,BreadCrumbService} from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var';

@Component({
  selector: 'app-content-file',
  templateUrl: './content-file.component.html',
  styleUrls: ['./content-file.component.css']
})
export class ContentFileComponent implements OnInit {

  courseId;
  fileList;
  
  constructor(private breadCrumbService :BreadCrumbService ,private activatedRoute: ActivatedRoute, public commonLabels: CommonLabels, private courseService: CourseService) {
      this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['id']; 
     });
   }

  ngOnInit() {
    let params = {
      courseId : this.courseId
    }
    let data = [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.labels.contentFile,url:''}]
    this.breadCrumbService.setTitle(data);
    this.courseService.getFiles(params).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.fileList = resp.data.rows;
        }
      })
    }
}
  

