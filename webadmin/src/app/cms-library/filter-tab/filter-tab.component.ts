import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { UtilService } from '../../services/util.service';
import { CourseService,CommonService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-filter-tab',
  templateUrl: './filter-tab.component.html',
  styleUrls: ['./filter-tab.component.css']
})
export class FilterTabComponent implements OnInit {
  @Input() selectedTab;
  @Input() filterUpdate;
  parentResort = null ;
  parentResortId = null ;
  courseFilterList = [];
  parentDivisionFilterList = [];
  childResortFilterList = [];
  trainingClassFilterList = [];
  childDivisionFilterList = [];
  parentDepartmentFilterList = [];
  childDepartmentFilterList = [];
  createdByList = [];
  filterCourse = 'null';
  filterParentDivision = 'null';
  filterChildDivision = 'null';
  filterChildResort = 'null';
  filterTrainingClass = 'null';
  filterChildDepartment = 'null';
  filterParentDepartment = 'null';
  filterCreatedBy = 'null';
  filterCourseStatus = 'null';
  search = '';
  roleId;
  parentResortList = [];
  enableResort = false;
  resourceLib = false;
  classViewChange;
  @Output() FilterSearchEvent = new EventEmitter<string>();
  @Output() classView = new EventEmitter<string>();
  

  constructor(private utilService : UtilService,private courseService : CourseService,public commonLabels : CommonLabels,
    private commonService : CommonService) {
      if (window.location.pathname.indexOf("resource") != -1) {
        this.resourceLib = true;
      }
     }

  ngOnInit() {
    let data = this.utilService.getUserData();
    this.classViewChange = 'course';
    if(data.ResortUserMappings.length){
      let resortDetails = data.ResortUserMappings;
      this.parentResort = resortDetails[0].Resort.resortName;
      this.parentResortId = resortDetails[0].Resort.resortId;
    }
    this.roleId = this.utilService.getRole();
    this.getFilterData();
    if(this.roleId == 2 || this.roleId == 4){
      this.enableResort = true;
    }
  }

  ngOnChanges(){
    this.classViewChange = 'course';
    // console.log(this.selectedTab , 'type',this.filterUpdate)
  }

  getFilterData(){
    let userId = this.utilService.getUserData().userId;
    let query = this.roleId != 1  ? '?created='+userId  : "";
    query+='&order='+1;
    //alert(query);
    // query+= this.roleId == 4 ? '&userId='+userId:"";
    this.courseService.getAllCourse(query).subscribe(result=>{
      if(result && result.isSuccess){
        this.courseFilterList = result.data && result.data.rows;
      }
    })
    let id = this.roleId != 1 ? this.parentResortId : '';
    this.courseService.getCreatedByDetails(id).subscribe(result=>{
      if(result && result.isSuccess){
        this.createdByList = result.data  && result.data;
      }
    })

    if(this.roleId == 1 ){
      let query = "?parents=1";
      this.commonService.getAllResort(query).subscribe(resp=>{
        // console.log(resp)
        if(resp && resp.isSuccess){
          this.parentResortList = resp.data && resp.data.length ? resp.data : [];
        }
      })
    }
    else{
      this.getDivisionDetails('');
    }

  }

  getDivisionDetails(resortId){
    let data = resortId ? resortId : this.parentResortId;
    if(data){
      this.courseService.getDivision(data,'parent').subscribe(result=>{
        if(result && result.isSuccess){
          this.parentDivisionFilterList = result.data && result.data.divisions;
        }
      })
    }
    let query = "?parentId="+data;
    this.commonService.getAllResort(query).subscribe(result=>{
      if(result && result.isSuccess){
        this.childResortFilterList = result.data  && result.data.length ? result.data : [];
      }
    })
  }

  courseChange(courseId){
    this.filterTrainingClass = 'null';
    this.courseService.getTrainingclassesById(courseId).subscribe(result=>{
      if(result && result.isSuccess){
        this.trainingClassFilterList = result.data && result.data.length && result.data;
      }
    })
  }
  

  divisionChange(divisionId,type){
    let id = type === 'parent' ? this.filterParentDivision : this.filterChildDivision;
    this.courseService.getDepartment(id).subscribe(result=>{
       if(type === 'parent'){
        this.parentDepartmentFilterList = result.data.rows && result.data.rows.length && result.data.rows;
      }
      else if(type === 'child'){
        this.childDepartmentFilterList = result.data.rows && result.data.rows.length && result.data.rows;
      }
      
    })
  }

  childResortChange(resortId){
   
    this.courseService.getDivision(this.filterChildResort,'parent').subscribe(result=>{
      if(result && result.isSuccess){
        this.childDivisionFilterList = result.data.divisions && result.data.divisions.length ? result.data.divisions : [];
        // console.log(this.childDivisionFilterList);
      }
    })
  }
  submitForm(data){
    let formValues = data.form.value;
    this.FilterSearchEvent.emit(formValues);
  }

  viewUpdate(){
    this.classView.emit(this.classViewChange)
  }

  resetFilter(){
    this.courseFilterList = [];
    this.parentDivisionFilterList = [];
    this.childResortFilterList = [];
    this.trainingClassFilterList = [];
    this.childDivisionFilterList = [];
    this.parentDepartmentFilterList = [];
    this.childDepartmentFilterList = [];
    this.createdByList = [];
    this.filterCourseStatus = 'null';
    this.filterCourse = 'null';
    this.filterParentDivision = 'null';
    this.filterChildDivision = 'null';
    this.filterChildResort = 'null';
    this.filterTrainingClass = 'null';
    this.filterChildDepartment = 'null';
    this.filterParentDepartment = 'null';
    this.filterCreatedBy = 'null';
    this.search = '';
    // this.classViewChange = 'course';

    this.getFilterData();
    
    this.FilterSearchEvent.emit(null);
  }
}
