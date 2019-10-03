import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 
import { Router, ActivatedRoute,Params } from '@angular/router';
import { HttpService,HeaderService,UtilService,AlertService,ExcelService, CourseService,BreadCrumbService } from '../../../services';
import { CommonLabels } from '../../../Constants/common-labels.var'
import * as moment from 'moment';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})

export class EmployeesListComponent implements OnInit {
  courseId;
  resortId;
  listDetails = [];
  count = 0;
  pageLimitOptions;
  pageLimit;

  constructor(private route: Router,private activatedRoute: ActivatedRoute,private utilService :UtilService,private courseService : CourseService,private headerService : HeaderService,private excelService : ExcelService,public commonLabels:CommonLabels,private breadCrumbService :BreadCrumbService,public location : Location) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.courseId = params['courseId']; 
      // console.log(this.courseId)
    });
  }

  ngOnInit() {
    let user = this.utilService.getUserData();
    this.resortId = user.ResortUserMappings.length ? user.ResortUserMappings[0].Resort.resortId : ''; 
    this.headerService.setTitle({ title: 'Resource Library', hidemodule: false });
    let data;
    if (window.location.pathname.indexOf("resource") != -1) {
      data = [{ title: this.commonLabels.labels.resourceLibrary, url: '/resource/library' }, { title: this.commonLabels.labels.empList, url: '' }]
    } else {
      data = [{ title: this.commonLabels.labels.resourceLibrary, url: '/cms-library' }, { title: this.commonLabels.labels.empList, url: '' }]
    }
    // [{title : this.commonLabels.labels.resourceLibrary,url:'/cms-library'},{title : this.commonLabels.labels.empList,url:''}]
    this.breadCrumbService.setTitle(data)
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[1]];
    this.getEmployeeList();
  }

  //Get Employee List
  getEmployeeList(){
    this.courseService.getEmployeeListDetails(this.resortId,this.courseId).subscribe(resp=>{
      // console.log(resp)
      if(resp && resp.isSuccess){
        this.listDetails = resp.data && resp.data.rows.length && resp.data.rows;
        this.count = resp.data && resp.data.rows.length && resp.data.count;
      }
    })
  }

  // Create Excel sheet
  exportAsXLSX():void {
    let data = this.listDetails.map(item => {
        let obj = {
            'User name': item.User && item.User.userName,
            'Status': item.status,
            'Assigned Date':item.created ?  moment(item.created).format('ll'): '',
            'Completed Date' :item.completedDate ? moment(item.completedDate).format('ll') : ''
        }
        return obj;
    })
    this.excelService.exportAsExcelFile(data, this.listDetails[0].Course.courseName);
  }
}
