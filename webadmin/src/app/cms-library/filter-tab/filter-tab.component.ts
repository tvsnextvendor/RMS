import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { CourseService } from '../../services/restservices';
import { CmsLibraryVar } from '../../Constants/cms-library.var';

@Component({
  selector: 'app-filter-tab',
  templateUrl: './filter-tab.component.html',
  styleUrls: ['./filter-tab.component.css']
})
export class FilterTabComponent implements OnInit {
  parentResort ;
  parentResortId ;
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

  constructor(private utilService : UtilService,private courseService : CourseService,public cmsLibraryVar : CmsLibraryVar) { }

  ngOnInit() {
    let data = this.utilService.getUserData();
    if(data.Resorts.length){
      let resortDetails = data.Resorts;
      this.parentResort = resortDetails[0].resortName;
      this.parentResortId = resortDetails[0].resortId;
      this.getFilterData();
    }
    // console.log(data);
  }

  getFilterData(){
    this.courseService.getAllCourse().subscribe(result=>{
      if(result && result.isSuccess){
        this.courseFilterList = result.data && result.data.rows;
      }
    })
    this.courseService.getDivision(this.parentResortId,'parent').subscribe(result=>{
      if(result && result.isSuccess){
        this.parentDivisionFilterList = result.data && result.data.divisions;
      }
    })
    this.courseService.getChildResort(this.parentResortId).subscribe(result=>{
      if(result && result.isSuccess){
        this.childResortFilterList = result.data  && result.data.Resort;
       
      }
    })

    this.courseService.getCreatedByDetails().subscribe(result=>{
      if(result && result.isSuccess){
        this.createdByList = result.data  && result.data;
      }
    })
  }

  courseChange(courseId){
    
    this.filterTrainingClass = 'null';
    this.courseService.getTrainingClassById(this.filterCourse).subscribe(result=>{
      if(result && result.isSuccess){
        this.trainingClassFilterList = result.data && result.data.length && result.data;
        console.log(result);
      }
    })
  }

  divisionChange(divisionId,type){
    console.log(divisionId);
    let id = type === 'parent' ? this.filterParentDivision : this.filterChildDivision;
    this.courseService.getDepartment(id).subscribe(result=>{
      console.log(result)
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
        this.childDivisionFilterList = result.data.divisions && result.data.divisions.length && result.data.divisions;
        console.log(this.childDivisionFilterList);
      }
    })
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
    this.filterCourse = 'null';
    this.filterParentDivision = 'null';
    this.filterChildDivision = 'null';
    this.filterChildResort = 'null';
    this.filterTrainingClass = 'null';
    this.filterChildDepartment = 'null';
    this.filterParentDepartment = 'null';
    this.filterCreatedBy = 'null';
    this.getFilterData();
  }
}
