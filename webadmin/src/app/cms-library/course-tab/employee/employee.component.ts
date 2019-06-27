import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import {Location} from '@angular/common';
import { HeaderService,UtilService,AlertService,ExcelService, CourseService,BreadCrumbService } from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  userId;
  resortId;
  pageLimitOptions;
  pageLimit;
  listDetails = [];
  count = 0;
  user;
  constructor(private breadCrumbService :BreadCrumbService,private route: Router,private activatedRoute: ActivatedRoute,private utilService :UtilService,private courseService : CourseService,private headerService : HeaderService,private excelService : ExcelService,public location : Location,public commonLabels:CommonLabels) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId']; 
      //console.log(this.userId)
    });
  }

  ngOnInit() {
    let user = this.utilService.getUserData();
    this.resortId = user.ResortUserMappings && user.ResortUserMappings[0].Resort.resortId;
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    let data = [{title : this.commonLabels.labels.cmsLibrary,url:'/cms-library'},{title : this.commonLabels.labels.employeeTabLabel,url:''}]
    this.breadCrumbService.setTitle(data);
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[1]];
    this.getEmployeeDetails();
  }
//Get status list
  getEmployeeDetails(){
    this.courseService.getEmployeeDetails(this.resortId,this.userId).subscribe(resp=>{
      //console.log(resp)
      if(resp && resp.isSuccess){
        this.listDetails = resp.data.rows.length ? resp.data.rows : [];
        this.count = resp.data.count ? resp.data.count : 0;
        this.user = resp.data.user;
      }
    })
  }

   // Create Excel sheet
   exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.listDetails, this.listDetails[0].Course.courseName);
  }
}
