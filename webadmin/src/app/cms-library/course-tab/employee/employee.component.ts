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
  trendType;
  id;
  topTitle;
  // added employee div Drop Down
  divIds;
  allDivisions;
  setDivIds;
  deptIds;
  allDepartments;
  setDeptIds;
  
  constructor(private breadCrumbService :BreadCrumbService,private route: Router,private activatedRoute: ActivatedRoute,private utilService :UtilService,private courseService : CourseService,private headerService : HeaderService,private excelService : ExcelService,public location : Location,public commonLabels:CommonLabels,private resortService : ResortService,
    private userService :UserService,private commonService :CommonService) { 
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userId = params['userId']; 
      //console.log(this.userId)
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.trendType = params.type;
      this.id = params.id;
      // this.courseId = params['id'];
    });
     // added employee div Drop Down
     this.divIds = this.utilService.getDivisions() ? this.utilService.getDivisions() :'';
     this.deptIds = this.utilService.getDepartment() ? this.utilService.getDepartment() :'';
  }

  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
    this.roleId = this.utilService.getRole()
    let user = this.utilService.getUserData();
    this.resortId = user.ResortUserMappings.length ? user.ResortUserMappings[0].Resort.resortId : '';
    this.topTitle = (this.trendType === 'class')? this.commonLabels.titles.trainingclassTrend:this.commonLabels.titles.courseTrend;
    this.headerService.setTitle({ title: this.topTitle, hidemodule: false });
    let data = [{title : this.topTitle,url:'/cms-library'},{title : this.commonLabels.labels.employeeTabLabel,url:''}]
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
    }
    if(this.search){
      dataQuery = dataQuery+"&search="+this.search;
    }else{
      // added employee div Drop Down
      dataQuery+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds :'';
      dataQuery+= (this.setDeptIds && this.roleId == 4)?"&departmentIds="+this.setDeptIds :'';
     
    }
    if(this.trendType && this.id){
      if(this.trendType == 'course'){
        dataQuery = dataQuery+'&courseId='+this.id
      }
      if(this.trendType == 'class'){
        dataQuery = dataQuery+'&trainingClassId='+this.id
      }
      if(this.trendType == 'notification'){
        dataQuery = dataQuery+'&notificationFileId='+this.id
      }
    }
    this.courseService.getEmployeeDetails(dataQuery).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.listDetails = resp.data.rows.length ? resp.data.rows : [];
        this.count = resp.data.count ? resp.data.count : 0;
        this.user = resp.data.user;
      }
    })
  }

   // Create Excel sheet
   exportAsXLSX():void {
     let data = this.listDetails.map(item => {
         let obj = {
             'Training Class': item.TrainingClass && item.TrainingClass.trainingClassName,
             'Content Files': item.File && item.File.fileName,
             'File Type':  item.File && item.File.fileExtension,
             'Status': item.status
         }
         return obj;
     })
    this.excelService.exportAsExcelFile(data,this.commonLabels.labels.statusList);
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
  this.resortId = ''
    if(type == "resort"){
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        // console.log(value);
        this.resortService.getResortByParentId(this.filterResort).subscribe((result) => {
            if (result.isSuccess) {
                // added employee div Drop Down
                this.allDivisions = result.data.divisions;
                if(this.divIds.length > 0 && this.roleId === 4){
                    this.divisionList = [];
                    this.allDivisions.filter(g => this.divIds.includes(g.divisionId)).map(g =>{
                        this.divisionList.push(g);
                    });
                }else{
                    this.divisionList = result.data.divisions;
                }
                 // added employee div Drop Down
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

              this.allDepartments = result.data.rows;
              if(this.deptIds.length > 0 && this.roleId === 4){
                  this.departmentList = [];
                  this.allDepartments.filter(g => this.deptIds.includes(g.departmentId)).map(g =>{
                      this.departmentList.push(g);
                  });
              }else{
                  this.departmentList = result.data.rows;
              }
                // this.departmentList = result.data.rows;
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
    // this.filterResort = null;
    this.filterDivision =null;
    this.filterDept = null;
    this.filterUser = null;
    this.empChange = false;
    this.search = '';
    this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
    this.filterResort = this.resortId;
    this.getEmployeeDetails('');
}
}
