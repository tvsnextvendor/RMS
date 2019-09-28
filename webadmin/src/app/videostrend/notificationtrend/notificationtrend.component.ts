import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common'; 
import {Router} from "@angular/router";
import {HttpService, HeaderService, AlertService, UtilService,PDFService, ExcelService, CommonService,BreadCrumbService,ResortService,UserService} from '../../services';
import {VideosTrendVar} from '../../Constants/videostrend.var';
import { API_URL } from '../../Constants/api_url';
import { CommonLabels } from '../../Constants/common-labels.var'
import * as moment from 'moment';

@Component({
  selector: 'app-notificationtrend',
  templateUrl: './notificationtrend.component.html',
  styleUrls: ['./notificationtrend.component.css']
})
export class NotificationtrendComponent implements OnInit {

  selectedModule;
  resortId;
  search;
  enableFilter = false;
  resortList = [];
  divisionList = [];
  departmentList = [];
  empList = [];
  xlsxList=[];
  allResorts;
  filterResort = null;
  filterDivision = null;
  filterDept = null;
  filterUser = null;
  roleId;
  // added employee div Drop Down
  divIds;
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
   private alertService : AlertService,
   private router : Router
   ) {
   this.trendsVar.url = API_URL.URLS;
   this.roleId = this.utilsService.getRole();
   this.resortId = this.utilsService.getUserData().ResortUserMappings.length ? this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId : '';
    // added employee div Drop Down
    this.divIds =this.utilsService.getDivisions() ? this.utilsService.getDivisions() :'';
    this.deptIds =this.utilsService.getDepartment() ? this.utilsService.getDepartment() :'';
  }

  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
   this.headerService.setTitle({title: this.commonLabels.labels.notificationTrend, hidemodule: false});
   this.breadCrumbService.setTitle([]);
   this.filterResort = this.resortId ? this.resortId : null;
   this.getVideosTrend('');
   this.getModuleList('');
   this.getResortList();
   this.trendsVar.pageLimitOptions = [5, 10, 25];
   this.trendsVar.pageLimit = [this.trendsVar.pageLimitOptions[0]];
   
  }

  ngDoCheck() {
   this.headerService.moduleSelection.subscribe(module => {
       this.selectedModule = module;
    });
   }


  onChangeModule() {
   this.getVideosTrend(this.trendsVar.moduleType);
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

  getVideosTrend(moduleType) {
   // moduleId to get trend videos list based on selected module type.
   const moduleId = moduleType;
   this.http.get(this.trendsVar.url.getVideoTrendList).subscribe((data) => {
       this.trendsVar.videosTrend = data.VideoTrendList;
   });
   }

   onLimitChange() {
       console.log(this.trendsVar.pageLimit);
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


   getModuleList(filter) {
       // console.log(this.trendsVar.years, 'yeeeaa');
       // console.log(this.trendsVar.months);
       const courseTrendObj = {
           year : this.trendsVar.years,
           month : this.trendsVar.months,
       };
       let query = this.resortId ? '&resortId='+this.resortId : '';
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
       this.commonService.getNotificationTrendList(courseTrendObj,query).subscribe((result) => {
         this.trendsVar.moduleList = result.data.rows;
       },err=>{
        this.trendsVar.moduleList = [];
        this.alertService.error(err.error.error);
       });
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
       this.pdfService.htmlPDFFormat(data,this.commonLabels.labels.notificationTrend);  
   }

   //Create Excel sheet
   exportAsXLSX():void {   
       this.trendsVar.moduleList.map(item=>{
           // moment().format('ll');
           let list = {
           "Schedule Name": item.scheduleName,
           "Uploaded Date": moment(item.created).format('ll'),
           "Modified Date": moment(item.updated).format('ll'),
           "No.of Resorts": item.resortsCount,
           "No. of Employees":item.employeesCount
           };
       this.xlsxList.push(list);
       })
       this.excelService.exportAsExcelFile(this.xlsxList, this.commonLabels.labels.notificationTrend);
   }

   onMail(){
    this.trendsVar.moduleList.map(item=>{
        // moment().format('ll');
        let list = {
        "Schedule Name": item.scheduleName,
        "Uploaded Date": moment(item.created).format('ll'),
        "Modified Date": moment(item.updated).format('ll'),
        "No.of Resorts": item.resortsCount,
        "No. of Employees":item.employeesCount
        };
    this.xlsxList.push(list);
    })
    // this.exportAsExcelWithFile(this.xlsxList, this.commonLabels.titles.courseTrend);
    localStorage.setItem('mailfile',JSON.stringify(this.xlsxList))
    this.router.navigate(['/email'],{queryParams :{type:'exportmail',selectedType:'notification'}})
}

   // getResort
   getResortList(){
       if(this.roleId != 1){
           this.commonService.getResortForFeedback(this.resortId).subscribe(item=>{
               if(item && item.isSuccess){
                   this.allResorts = item.data && item.data.rows.length ? item.data.rows : [];
                   if (this.roleId === 4) {
                       this.resortList = [];
                       let empResort = this.allResorts.map(x => {
                           if (x.resortId === this.resortId) {
                               this.resortList.push(x);
                           }
                       });
                   } else {
                       this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
                   }

                   this.filterSelect(this.filterResort,'resort')
               } 
           })
           // this.resortService.getResort().subscribe(item=>{
           //     if(item && item.isSuccess){
           //         this.resortList = item.data && item.data.rows.length ? item.data.rows : [];
           //         this.filterSelect(this.filterResort,'resort')
           //     } 
           // })
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
       this.resortId = '';
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
                  
                   let query = "&resortId="+this.filterResort;
                   this.getModuleList(query);
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
                //    this.departmentList = result.data.rows;
                this.allDepartments = result.data.rows;
                if(this.deptIds.length > 0 && this.roleId === 4){
                    this.departmentList = [];
                    this.allDepartments.filter(g => this.deptIds.includes(g.departmentId)).map(g =>{
                        this.departmentList.push(g);
                    });
                }else{
                    this.departmentList = result.data.rows;
                }
                   let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision;
                   this.getModuleList(query);
               }
           })
       }
       else if(type == "dept"){
           this.filterUser = null;
           // console.log(value);
           // let data = { 'departmentId': this.filterDept, 'createdBy': ' ' };
           // this.roleId != 1 ? data.createdBy =  this.utilsService.getUserData().userId : delete data.createdBy;
           // this.userService.getUserByDivDept(data).subscribe(result => {
           //     if (result && result.data) {
           //         this.empList = result.data;
           let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept;
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

   ngOnDestroy(){
        this.search = '';
        this.trendsVar.years = '';
        this.trendsVar.months = '';
        this.trendsVar.moduleList = [];
    }

}
