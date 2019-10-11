import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common'; 
import {Router} from'@angular/router';
import {HttpService, HeaderService, UtilService,AlertService, PDFService, ExcelService, CommonService,BreadCrumbService,ResortService,UserService} from '../services';
import {VideosTrendVar} from '../Constants/videostrend.var';
import { API_URL } from '../Constants/api_url';
import { CommonLabels } from '../Constants/common-labels.var'
import * as moment from 'moment';

@Component({
    selector: 'app-videostrend',
    templateUrl: './videostrend.component.html',
    styleUrls: ['./videostrend.component.css'],
})

export class VideosTrendComponent implements OnInit {

   selectedModule;
   resortId;
   allResorts;
   search;
   enableFilter = false;
   resortList = [];
   divisionList = [];
   departmentList = [];
   empList = [];
   xlsxList=[];
   filterResort = null;
   filterDivision = null;
   filterDept = null;
   filterUser = null;
   roleId;
   divIds;
   totalCount;
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
    this.divIds =this.utilsService.getDivisions() ? this.utilsService.getDivisions() :'';
    this.deptIds =this.utilsService.getDepartment() ? this.utilsService.getDepartment() :'';
   
   }

   ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
    this.headerService.setTitle({title: this.commonLabels.titles.courseTrend, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    let filterSite = localStorage.getItem('filterSite');
    filterSite && localStorage.removeItem('filterSite');
    this.resortId = this.utilsService.getUserData().ResortUserMappings.length ? this.utilsService.getUserData().ResortUserMappings[0].Resort.resortId : '';
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
       if(this.trendsVar.years == ''){
           this.trendsVar.months = '';
       }
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
            query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
            query+= (this.setDeptIds && this.roleId == 4)?'&departmentIds='+this.setDeptIds:'';
        }
        if(this.roleId == 4){
            let user = this.utilsService.getUserData();
            query = query+'&userId='+user.userId;
        }

        this.commonService.getCourseTrendList(courseTrendObj,query).subscribe((result) => {
          this.trendsVar.moduleList = result.data.rows;
          this.totalCount = result.data.count;
        },err => {
            this.trendsVar.moduleList = [];
            this.alertService.error(err.error.error)
        });
    }

    resetSearch(){
        this.search = '';
        this.getModuleList('');
    }

    onPrint(){
        window.print();
    }

    onMail(){
        this.trendsVar.moduleList.map(item=>{
            // moment().format('ll');
            let list =  {
                "Course Name": item.courseName,
                "Total Training Classes" : item.noOfClasses,
                "No. of employee assigned to" : item.employeesCount,
                "Frequently failed classes"  : item.failedClassesCount,
                // "Uploaded Date": moment(item.created).format('ll'),
                // "Modified Date": moment(item.updated).format('ll'),
                "No.of Sites": item.resortsCount,
                // "No. of Employees":item.employeesCount
                };
            this.xlsxList.push(list);
        })
        // this.exportAsExcelWithFile(this.xlsxList, this.commonLabels.titles.courseTrend);
        localStorage.setItem('mailfile',JSON.stringify(this.xlsxList))
        this.router.navigate(['/email'],{queryParams :{type:'exportmail',selectedType:'course'}})
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
                "Total Training Classes" : item.noOfClasses,
                "No. of employee assigned to" : item.employeesCount,
                "Frequently failed classes"  : item.failedClassesCount,
                "Assigned Count": item.assignedCount,
                "Inprogress Count":item.inProgressCount,
                "Completed Count":item.completedCount,
                "Expired Count":item.expiredCount,
                // "Uploaded Date": moment(item.created).format('ll'),
                // "Modified Date": moment(item.updated).format('ll'),
                "No.of Sites": item.resortsCount,
                // "No. of Employees":item.employeesCount
            };
        this.xlsxList.push(list);
        })
        this.excelService.exportAsExcelFile(this.xlsxList, this.commonLabels.titles.courseTrend);
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
                    this.filterSelect('','resort')
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

    countUpdate(data,type,tab){
        let total = parseInt(data.assignedCount)+parseInt(data.inProgressCount)+parseInt(data.completedCount)+parseInt(data.expiredCount);
        let value = type == 'course' ? parseInt(data.assignedCount) : type == 'progress' ? parseInt(data.inProgressCount) : type == 'complete' ? parseInt(data.completedCount) :  parseInt(data.expiredCount);
        let returnValue = this.calculatePercent(total,value);
        if(tab == 'count'){
            return returnValue.toFixed(2);
        }
        else{
            return returnValue
        }
    }

    calculatePercent(totalempCount, individualCount) {
        if (totalempCount > 0) {
          let totalEmpPer = 100 / totalempCount;
          return individualCount * totalEmpPer;
        } else {
          return 0;
        }
      }

    ngOnDestroy(){
        this.search = '';
        this.trendsVar.years = '';
        this.trendsVar.months = '';
    }

}
