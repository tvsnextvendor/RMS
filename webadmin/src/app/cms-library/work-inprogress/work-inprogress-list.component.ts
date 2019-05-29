import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,CourseService,CommonService,AlertService ,UtilService} from '../../services';
import { CmsLibraryVar } from '../../Constants/cms-library.var';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-work-inprogress-tab',
  templateUrl: './work-inprogress-list.component.html',
  styleUrls: ['./work-inprogress-list.component.css']
})
export class WorkCourseListComponent implements OnInit {
  pageSize;
  p;
  totalCourseCount;
  courseListValue = [];
  enableView;
  enableIndex;

  constructor(private courseService : CourseService ,public commonLabels : CommonLabels,private route: Router,public cmsLibraryVar : CmsLibraryVar,private commonService:CommonService,private alertService : AlertService,private utilService : UtilService,private headerService : HeaderService) { }
  

  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    this.pageSize = 10;
    this.p=1;
    this.getCourseDetails(); 
  }

  getCourseDetails(){
    let query = '&status=workInprogress';
    this.courseService.getCourse(this.p,this.pageSize,query).subscribe(resp=>{

      if(resp && resp.isSuccess){
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
        // if(this.addedFiles){
        //    this.selectedIndex = localStorage.getItem('index');
        //    this.enableDropData('edit',parseInt(this.selectedIndex));
        // }
      }
    });
   
  }

  enableDropData(type,index){

    localStorage.setItem('index', index)
    if(type === "view"){
      this.enableView = this.enableIndex === index ? !this.enableView : true;
      this.enableIndex = index;
    }
    else if(type === "closeDuplicate"){
      this.enableView = true;
    }
    else if(type === "closeEdit"){
      this.enableView = false;
    }
    else if(type === "edit"){
      console.log(this.courseListValue[index])
      let course = this.courseListValue[index];
      this.route.navigateByUrl('/module/'+course.courseId);
    }
    else if(type === 'trainingClass'){
      let value = {tab : 'training'}
    }
  }

  pageChanged(e){
      this.p = e;
      this.getCourseDetails();
      this.enableDropData('closeEdit','');
  }

  calculateContentFiles(courses){
    let i =0;
    courses.forEach(function(value,key){
      i = i + parseInt(value.TrainingClass.Files.length);
    });
    return i;
  }

  goTocmsLibrary(){
    // this.completed.emit('completed'); 
    this.route.navigateByUrl('/cms-library');
  }
}

