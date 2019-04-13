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

  constructor(private utilService : UtilService,private courseService : CourseService,private cmsLibraryVar : CmsLibraryVar) { }

  ngOnInit() {
    let data = this.utilService.getUserData();
    let resortDetails = data.Resorts;
    this.parentResort = resortDetails[0].resortName;
    this.parentResortId = resortDetails[0].resortId;
    // console.log(data);
    this.getFilterData();
  }

  getFilterData(){
    this.courseService.getAllCourse().subscribe(result=>{
      if(result && result.isSuccess){
        this.courseFilterList = result.data && result.data.rows.length && result.data.rows;
      }
    })
    this.courseService.getDivision(this.parentResortId,'parent').subscribe(result=>{
      if(result && result.isSuccess){
        this.parentDivisionFilterList = result.data.divisions && result.data.divisions.length && result.data.divisions;
        console.log(this.parentDivisionFilterList);
      }
    })
    this.courseService.getChildResort(this.parentResortId).subscribe(result=>{
      if(result && result.isSuccess){
        this.childResortFilterList = result.data.Resort && result.data.Resort.length && result.data.Resort;
        console.log(result);
      }
    })

    this.courseService.getCreatedByDetails().subscribe(result=>{
      if(result && result.isSuccess){
        this.createdByList = result.data && result.data.length && result.data;
        console.log(result);
      }
    })
  }

  courseChange(courseId){
    console.log(courseId)
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
    console.log(this.filterChildResort);
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
