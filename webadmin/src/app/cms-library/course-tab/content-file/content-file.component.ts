import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params } from '@angular/router';
import {CourseService} from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var';

@Component({
  selector: 'app-content-file',
  templateUrl: './content-file.component.html',
  styleUrls: ['./content-file.component.css']
})
export class ContentFileComponent implements OnInit {

  courseId;
  fileList;
  
  constructor(private activatedRoute: ActivatedRoute, public commonLabels: CommonLabels, private courseService: CourseService) {
      this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['id']; 
     });
   }

  ngOnInit() {
    let params = {
      courseId : this.courseId
    }
    this.courseService.getFiles(params).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.fileList = resp.data.rows;
        }
      })
    }
}
  

