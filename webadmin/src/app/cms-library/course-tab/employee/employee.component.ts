import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,Params } from '@angular/router';
import {Location} from '@angular/common';
import { HeaderService,UtilService,AlertService,ExcelService, CourseService,BreadCrumbService,ResortService,UserService,CommonService } from '../../../services';
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
  resortList = [];
  divisionList = [];
  departmentList = [];
  empList = [];
  filterResort = null;
  filterDivision = null;
  filterDept = null;
  filterUser = null;
  roleId;
  enableFilter= false;
  empChange = false;
  search;
  
  constructor(private breadCrumbService :BreadCrumbService,private route: Router,private activatedRoute: ActivatedRoute,private utilService :UtilService,private courseService : CourseService,private headerService : HeaderService,private excelService : ExcelService,public location : Location,public commonLabels:CommonLabels,private resortService : ResortService,
    private userService :UserService,private commonService :CommonService) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId']; 
      //console.log(this.userId)
    });
  }

  ngOnInit() {
    this.roleId = this.utilService.getRole()
    let user = this.utilService.getUserData();
    this.resortId = user.ResortUserMappings.length ? user.ResortUserMappings[0].Resort.resortId : '';
    this.headerService.setTitle({ title: this.commonLabels.labels.resourceLibrary, hidemodule: false });
    let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/cms-library'},{title : this.commonLabels.labels.employeeTabLabel,url:''}]
    this.breadCrumbService.setTitle(data);
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[1]];
    this.filterResort = this.resortId ? this.resortId : null;
    this.getEmployeeDetails('');
    this.getResortList();
  }
//Get status list
  getEmployeeDetails(query){
    let dataQuery = this.resortId ? '?resortId='+this.resortId+'&userId='+this.userId : '?userId='+this.userId ;
    if(query){
      dataQuery = this.empChange ? query : query+'&userId='+this.userId; 
      // dataQuery = query;
    }
    if(this.search){
      dataQuery = dataQuery+"&search="+this.search;
    }

    this.courseService.getEmployeeDetails(dataQuery).subscribe(resp=>{
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

  getResortList(){
    if(this.roleId != 1){
        // this.resortService.getResort().subscribe(item=>{
        //     if(item && item.isSuccess){
        //         this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
        //         this.filterSelect(this.filterResort,'resort')
        //     } 
        // })
        this.commonService.getResortForFeedback(this.resortId).subscribe(item=>{
          if(item && item.isSuccess){
              this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
              this.filterSelect(this.filterResort,'resort')
          } 
      })
    }
    else{
        this.commonService.getAllResort('').subscribe(item=>{
            if(item && item.isSuccess){
                this.resortList = item.data && item.data.length ? item.data : [];
                // this.filterSelect(this.filterResort,'resort')
            } 
        })
    }
}

filterSelect(value,type){
    if(type == "resort"){
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        // console.log(value);
        this.resortService.getResortByParentId(this.filterResort).subscribe((result) => {
            if (result.isSuccess) {
                this.divisionList = result.data.divisions;
                let query = "?resortId="+this.filterResort;
                this.getEmployeeDetails(query);
            }
        })

    }
    else if(type == "division"){
        this.filterDept = null;
        this.filterUser = null;
        // console.log(value);
        let obj = { 'divisionId': this.filterDivision };
        this.commonService.getDepartmentList(obj).subscribe((result) => {
            if (result.isSuccess) {
                this.departmentList = result.data.rows;
                let query = "?resortId="+this.filterResort+"&divisionId="+this.filterDivision;
                this.getEmployeeDetails(query);
            }
        })
    }
    else if(type == "dept"){
        this.filterUser = null;
        // console.log(value);
        let data = { 'departmentId': this.filterDept, 'createdBy': ' ' };
        this.roleId != 1 ? data.createdBy =  this.utilService.getUserData().userId : delete data.createdBy;
        this.userService.getUserByDivDept(data).subscribe(result => {
            if (result && result.data) {
                this.empList = result.data;
                let query = "?resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
                this.getEmployeeDetails(query);
            }

        })
    }
    else if(type == "emp"){
        // console.log(value);
        let query = "?resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+this.filterUser;
        this.empChange = true;
        this.getEmployeeDetails(query);
    }

}

resetFilter(){
    this.filterResort = null;
    this.filterDivision =null;
    this.filterDept = null;
    this.filterUser = null;
    this.empChange = false;
    this.search = '';
    this.getEmployeeDetails('');
}
}
