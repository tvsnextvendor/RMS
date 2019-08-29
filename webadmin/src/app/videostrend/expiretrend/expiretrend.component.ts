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
    }


  ngOnInit() {
    this.headerService.setTitle({title: this.commonLabels.labels.expiringTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    // this.getExpireTrendList('');
    this.filterResort = this.resortId ? this.resortId : null;
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
            this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
            this.filterSelect(this.filterResort,'resort')
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
    if(type == "resort"){
        this.filterDivision =null;
        this.filterDept = null;
        this.filterUser = null;
        this.resortService.getResortByParentId(this.filterResort).subscribe((result) => {
            if (result.isSuccess) {
                this.divisionList = result.data.divisions;
                let query = "&resortId="+this.filterResort;
                this.getModuleList(query);
            }
        })
    }
    else if(type == "division"){
        this.filterDept = null;
        this.filterUser = null;
        let obj = { 'divisionId': this.filterDivision };
        this.commonService.getDepartmentList(obj).subscribe((result) => {
            if (result.isSuccess) {
                this.departmentList = result.data.rows;
                let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision;
                this.getModuleList(query);
            }
        })
    }
    else if(type == "dept"){
        this.filterUser = null;
        let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
        this.getModuleList(query);
    }
    else if(type == "emp"){
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

ngOnDestroy(){
  this.search = '';
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
  this.trendsVar.moduleList.map(item=>{
      // moment().format('ll');
      let list = {
      "Course Name": item.courseName,
      "No.of Resorts": item.resortsCount,
      "No. of Employees":item.employeesCount
      };
  this.xlsxList.push(list);
  })
  this.excelService.exportAsExcelFile(this.xlsxList, this.commonLabels.titles.courseTrend);
}

onMail(){
  this.trendsVar.moduleList.map(item=>{
      // moment().format('ll');
      let list = {
      "Training Class Name": item.trainingClassName,
      "No.of Resorts": item.resortsCount,
      "No. of Employees":item.employeesCount
      };
  this.xlsxList.push(list);
  })
  // this.exportAsExcelWithFile(this.xlsxList, this.commonLabels.titles.courseTrend);
  localStorage.setItem('mailfile',JSON.stringify(this.xlsxList))
  this.route.navigate(['/email'],{queryParams :{type:'exportmail'}})
}
}
