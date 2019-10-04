import { Component, OnInit,ViewChild } from '@angular/core';
import { Location } from '@angular/common'; 
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import {HttpService, HeaderService, UtilService,PDFService, ExcelService, CommonService,BreadCrumbService,ResortService,UserService} from '../../services';
import {VideosTrendVar} from '../../Constants/videostrend.var';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
  selector: 'app-expiretrend',
  templateUrl: './expiretrend.component.html',
  styleUrls: ['./expiretrend.component.css']
})
export class ExpiretrendComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  moduleList = [];
  classList = [];
  resortList = [];
  roleId = null;
  resortId = null;
  filterResort = null;
  filterDivision = null;
  filterDept = null;
  filterUser = null;
  divisionList = [];
  departmentList = [];
  enableFilter = false;
  search;
  xlsxList = [];
  seletedTab = 'course';
  // added employee div Drop Down
  divIds;
  allResorts;
  allDivisions;
  setDivIds;
  deptIds;
  allDepartments;
  setDeptIds;


  constructor(private headerService: HeaderService,
    public trendsVar: VideosTrendVar ,
    private http: HttpService,
    private commonService: CommonService,
    private utilsService: UtilService,
    public location :Location,
    public commonLabels:CommonLabels,
    private breadCrumbService :BreadCrumbService,
    private pdfService:PDFService,
    private excelService: ExcelService,
    private resortService :ResortService,
    private userService : UserService,
    private route : Router,
    private activatedRoute : ActivatedRoute) { 
      this.roleId = this.utilsService.getRole();
      this.resortId = this.utilsService.getUserData().ResortUserMappings.length ? this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId : '';
      this.activatedRoute.queryParams.subscribe(item=>{
        if(item && item.type){
          this.seletedTab = item.type;
        }
      })
       // added employee div Drop Down
      this.divIds = this.utilsService.getDivisions() ? this.utilsService.getDivisions() :'';
      this.deptIds = this.utilsService.getDepartment() ? this.utilsService.getDepartment() :'';
    }


  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
    this.headerService.setTitle({title: this.commonLabels.labels.expiringTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    // this.getExpireTrendList('');
    this.filterResort = this.resortId ? this.resortId : null;
    let filterSite = localStorage.getItem('filterSite');
    filterSite && localStorage.removeItem('filterSite');
    this.getModuleList('');
    this.getResortList();
  }

  getModuleList(filter) {
    // console.log(this.trendsVar.years, 'yeeeaa');
    // console.log(this.trendsVar.months);
    const courseTrendObj = {
        year : this.trendsVar.years,
        month : this.trendsVar.months,
    };
    let query = this.resortId ? '&resortId='+this.resortId+"&expire=1"  : ''+"&expire=1" ;
    if(this.search){
        query = this.resortId ? '&resortId='+this.resortId+"&search="+this.search : "&search="+this.search ;
    }
    if(filter){
        query = query+filter;
    }else{
      // added employee div Drop Down
      query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
      query+= (this.setDeptIds && this.roleId == 4)?'&departmentIds='+this.setDeptIds:'';
    }
    if(this.roleId == 4){
      let user = this.utilsService.getUserData();
      query = query+'&userId='+user.userId;
    }
    if(this.seletedTab == 'course'){
      this.commonService.getCourseTrendList(courseTrendObj,query).subscribe((result) => {
        if(result && result.isSuccess){
          this.moduleList = result.data && result.data.rows && result.data.rows.length ? result.data.rows : [];
        }
        else{
          this.moduleList = [];
        }
      });
    }
    if(this.seletedTab == 'class'){
      this.commonService.getClassTrendList(courseTrendObj,query).subscribe((result) => {
        if(result && result.isSuccess){
          this.classList = result.data && result.data.rows && result.data.rows.length ? result.data.rows : [];
        }
        else{
          this.classList = [];
        }
      })
    }
}
   // getResort
    getResortList(){
      if(this.roleId != 1){
        this.commonService.getResortForFeedback(this.resortId).subscribe(item=>{
          if(item && item.isSuccess){
             this.allResorts=item.data && item.data.rows.length ? item.data.rows : [];
              if (this.roleId === 4) {
                        this.resortList = [];
                          let empResort = this.allResorts.map(x =>{
                              if(x.resortId === this.resortId) {
                                this.resortList.push(x);
                              }
                           });
              }else{
                 this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
              }
            this.filterSelect('','resort')
          } 
        })
      }
      else{
        this.commonService.getAllResort('').subscribe(item=>{
            if(item && item.isSuccess){
                this.resortList = item.data && item.data.length ? item.data : [];
            } 
        })
      }
    }


    filterSelect(value,type){
      this.resortId = '';
      let resortid = this.utilsService.getUserData().ResortUserMappings.length ? this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId : '';
      if(type == "resort"){
          this.filterDivision =null;
          this.filterDept = null;
          this.filterUser = null;
          let filterResort; 
          if(this.filterResort && this.filterResort != 'null') {
              filterResort = this.filterResort;
              localStorage.setItem('filterSite',filterResort);
              this.resortService.getResortByParentId(filterResort).subscribe((result) => {
                  if (result.isSuccess) {
                      this.allDivisions = result.data.divisions;
                      if(this.divIds.length > 0 && this.roleId === 4){
                          this.divisionList = [];
                          this.allDivisions.filter(g => this.divIds.includes(g.divisionId)).map(g =>{
                              this.divisionList.push(g);
                          });
                      }else{
                          this.divisionList = result.data.divisions;
                      }
                  }
              })
          }  else{
              filterResort = resortid;
              this.divisionList = [];
              this.departmentList = [];
          } 
          let query = "&resortId="+filterResort;
          if(value){
              this.getModuleList(query);
          } 

      }
      else if(type == "division"){
          this.filterDept = null;
          this.filterUser = null;
          // console.log(value);
          this.filterDivision = this.filterDivision && this.filterDivision != 'null' ? this.filterDivision : null;
          let filterDivision = this.filterDivision ? this.filterDivision : '';
          if(this.filterDivision){
              let obj = { 'divisionId': this.filterDivision };
              this.commonService.getDepartmentList(obj).subscribe((result) => {
                  if (result.isSuccess) {
                      // this.departmentList = result.data.rows;
                      this.allDepartments = result.data.rows;
                      if(this.deptIds.length > 0 && this.roleId === 4){
                          this.departmentList = [];
                          this.allDepartments.filter(g => this.deptIds.includes(g.departmentId)).map(g =>{
                              this.departmentList.push(g);
                          });
                      }else{
                          this.departmentList = result.data.rows;
                      }
                  }
              })
          }
          else{
              this.departmentList = [];
          }
          let query = "&resortId="+this.filterResort+"&divisionId="+filterDivision;
          this.getModuleList(query);
      }
      else if(type == "dept"){
          this.filterUser = null;
          // console.log(value);
          // let data = { 'departmentId': this.filterDept, 'createdBy': ' ' };
          // this.roleId != 1 ? data.createdBy =  this.utilsService.getUserData().userId : delete data.createdBy;
          // this.userService.getUserByDivDept(data).subscribe(result => {
          //     if (result && result.data) {
          //         this.empList = result.data;
          this.filterDept = this.filterDept && this.filterDept != 'null' ? this.filterDept : null;
          let filterDept = this.filterDept ? this.filterDept : '';
          let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+filterDept;
          this.getModuleList(query);
              // }

          // })
      }
      else if(type == "emp"){
          // console.log(value);
          let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+this.filterUser;
          this.getModuleList(query);
      }

  }

  
  onChangeYear() {
    let query = '';
    if(this.enableFilter){
        if(this.filterResort){
            query ="&resortId="+this.filterResort;
        }
        if(this.filterDivision){
            query = query+"&divisionId="+this.filterDivision;
        }
        if(this.filterDept){
            query = query+"&departmentId="+this.filterDept;
        }
        if(this.filterUser){
            query =  query+"&userId="+this.filterUser;  
        }
    }
    this.getModuleList(query);
}

onChangeMonth() {
  let query = '';
  if(this.enableFilter){
      if(this.filterResort){
          query ="&resortId="+this.filterResort;
      }
      if(this.filterDivision){
          query = query+"&divisionId="+this.filterDivision;
      }
      if(this.filterDept){
          query = query+"&departmentId="+this.filterDept;
      }
      if(this.filterUser){
          query =  query+"&userId="+this.filterUser;  
      }
  }
  this.getModuleList(query);
}

resetFilter(){
  this.filterDivision =null;
  this.filterDept = null;
  this.filterUser = null;
  this.trendsVar.years = '';
  this.trendsVar.months = '';
  this.resortId = this.utilsService.getUserData().ResortUserMappings.length ? this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId : null;
  this.filterResort = this.resortId;
  this.getModuleList('');
}

dataSelect(type){
  this.seletedTab = type;
  this.route.navigate(['/expiring/trend'],{queryParams : {type : type}});
    // this.getModuleList('');
  this.resetFilter();
}
resetSearch(){
  this.search = '';
  this.getModuleList('');
}

onPrint(){
  window.print();
}


// Create PDF
exportAsPDF(){ 
  var data = document.getElementById('courseTrend'); 
  this.pdfService.htmlPDFFormat(data,this.commonLabels.titles.courseTrend);  
}

//Create Excel sheet
exportAsXLSX():void {   
  if(this.seletedTab == 'course'){
    this.moduleList.forEach(item=>{
        // moment().format('ll');
          let list ={
            "Course Name": item.courseName,
            // "No.of Resorts": item.resortsCount,
            "No. of Employees":item.employeesCount
          }
          this.xlsxList.push(list);
      })
      
  }
  else{
    this.classList.forEach(item=>{
      let list ={
        "Training Class Name": item.trainingClassName,
        // "No.of Resorts": item.resortsCount,
        "No. of Employees":item.employeesCount
        };
      this.xlsxList.push(list);
    })
  }
  this.excelService.exportAsExcelFile(this.xlsxList, this.commonLabels.titles.courseTrend);
}

onMail(){
   if(this.seletedTab == 'course'){
      this.moduleList.forEach(item=>{
          // moment().format('ll');
            let list ={
              "Course Name": item.courseName,
              "No.of Sites": item.resortsCount,
              "No. of Employees":item.employeesCount
            }
            this.xlsxList.push(list);
        })
        
    }
    else{
      this.classList.forEach(item=>{
        let list ={
          "Training Class Name": item.trainingClassName,
          "No.of Sites": item.resortsCount,
          "No. of Employees":item.employeesCount
          };
        this.xlsxList.push(list);
      })
    }
  // this.exportAsExcelWithFile(this.xlsxList, this.commonLabels.titles.courseTrend);
  localStorage.setItem('mailfile',JSON.stringify(this.xlsxList))
  this.route.navigate(['/email'],{queryParams :{type:'exportmail',selectedType:'expire'}})
}
ngOnDestroy(){
  this.search = '';
  this.trendsVar.years = '';
  this.trendsVar.months = '';
  }
}
