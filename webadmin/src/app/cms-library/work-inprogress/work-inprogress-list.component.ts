import { Component, OnInit,Output,EventEmitter,Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,CourseService,CommonService,AlertService ,UtilService,BreadCrumbService} from '../../services';
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
  @Input() CMSFilterSearchEventSet;
  @Output() trainingClassListTab =  new EventEmitter();

  constructor(private courseService : CourseService ,public commonLabels : CommonLabels,private route: Router,public cmsLibraryVar : CmsLibraryVar,private commonService:CommonService,private alertService : AlertService,private utilService : UtilService,private headerService : HeaderService,private breadCrumbService :BreadCrumbService) { }
  

  ngOnInit() {
    // this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    let data = [{title : this.commonLabels.labels.edit,url:'/cms-library'},{title : this.commonLabels.btns.workinProgress,url:''}]
    this.breadCrumbService.setTitle(data);
    this.pageSize = 10;
    this.p=1;
    this.getCourseDetails(); 
  }

  ngDoCheck() {
    if (this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '') {
      this.p = 1;
      this.getCourseDetails();
    } 
  } 

  getCourseDetails(){
    let roleId = this.utilService.getRole();
    let userData = this.utilService.getUserData();
    let resortId = userData.ResortUserMappings && userData.ResortUserMappings.length && userData.ResortUserMappings[0].Resort.resortId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&status=workInprogress' : (roleId !=1 ? '&status=workInprogress&created='+userData.userId+'&resortId='+resortId : '&status=workInprogress');
    this.courseService.getCourse(this.p,this.pageSize,query).subscribe(resp=>{
      this.CMSFilterSearchEventSet = '';
      if(resp && resp.isSuccess){
        this.totalCourseCount = resp.data.count;
        this.courseListValue = resp.data && resp.data.rows.length ? resp.data.rows : [];
        // if(this.addedFiles){
        //    this.selectedIndex = localStorage.getItem('index');
        //    this.enableDropData('edit',parseInt(this.selectedIndex));
        // }
      }
    }, err => {
      this.CMSFilterSearchEventSet = '';
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

  tabChange(tabName,id,courseId,count) {
    let data = {tab : tabName,id:'',courseId : id}
    this.trainingClassListTab.next(data);
}
  pageChanged(e){
      this.p = e;
      this.getCourseDetails();
      this.enableDropData('closeEdit','');
  }

  calculateContentFiles(courses){
    let i =0;
    courses.forEach(function(value,key){
      i = i + parseInt(value.TrainingClass.FileMappings.length);
    });
    return i;
  }

  goTocmsLibrary(){
    // this.completed.emit('completed'); 
    this.route.navigateByUrl('/cms-library');
  }
}

