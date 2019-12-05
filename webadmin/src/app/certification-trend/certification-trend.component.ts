import { Component, OnInit } from '@angular/core';
import { CommonService, BreadCrumbService, HeaderService, UtilService,ResortService,PDFService, ExcelService, AlertService, UserService } from '../services';
import { CommonLabels } from '../Constants/common-labels.var'
import { VideosTrendVar } from '../Constants/videostrend.var';
import { Location } from '@angular/common';

@Component({
  selector: 'app-certification-trend',
  templateUrl: './certification-trend.component.html',
  styleUrls: ['./certification-trend.component.css']
})
export class CertificationTrendComponent implements OnInit {

  pageLimitOptions;
  pageLimit;
  search = '';
  empList = [];
  trendList = [];
  xlsxList = [];
  resortId;
  totalCount;
  // added employee div Drop Down
  divIds;
  allDivisions;
  setDivIds;
  allResorts;
  deptIds;
  allDepartments;
  setDeptIds;
  roleId;
  userId;
  filterUser = null;
  filterResort = null;
  filterDivision = null;
  filterDept = null;
  enableFilter = false;
  resortList = [];
  divisionList = [];
  departmentList = [];

  constructor(public location: Location,private userService: UserService,private commonService: CommonService,private resortService :ResortService,public commonLabels: CommonLabels, private excelService: ExcelService, private pdfService: PDFService,private alertService : AlertService,private breadCrumbService: BreadCrumbService, private headerService: HeaderService, private utilService: UtilService, public trendsVar: VideosTrendVar) {
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[0]];
    this.roleId = this.utilService.getRole();
    // added employee div Drop Down
    this.divIds = this.utilService.getDivisions() ? this.utilService.getDivisions() : '';
    this.deptIds = this.utilService.getDepartment() ? this.utilService.getDepartment() : '';
  }
  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0) ? this.divIds.join(',') : '';
    this.setDeptIds = (this.deptIds.length > 0) ? this.deptIds.join(',') : '';
    this.headerService.setTitle({ title: this.commonLabels.labels.certifiTrend, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.userId = this.utilService.getUserData().userId;
    this.resortId = this.utilService.getUserData() && this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.getResortList();
    this.getModuleList('');
    //this.getTrendCountList();
  }
  // getTrendList() {
  //   let query = this.search ? "?search=" + this.search : '';
  //   this.commonService.getCertificateTrendList(query).subscribe((res) => {
  //     if (res.isSuccess) {
  //       this.trendList = res.data.rows.length ? res.data.rows : [];
  //     }
  //   });
  // }

  getTrendCountList() {
    const courseTrendObj = {
        year: this.trendsVar.years,
        month: this.trendsVar.months,
    };
    let query = this.resortId ? "?resortId=" + this.resortId + "&search=" + this.search : (this.search != '' ? "?search=" + this.search : '');
    query += (this.roleId == 4) ? "&userId=" + this.userId : '';
    // query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
    // query+= (this.setDeptIds && this.roleId == 4)?'&departmentIds='+this.setDeptIds:'';
    this.commonService.certificateTrendCount(courseTrendObj,query).subscribe((res) => {
      if (res.isSuccess) {
        this.trendList = res.data.rows.length ? res.data.rows : [];
        this.totalCount = res.data.rows.length;
      } else {
        this.trendList = [];
      }
    });
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


    onChangeYear() {
      if (this.trendsVar.years == '') {
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


   filterSelect(value,type){
    this.resortId = '';
    let resortid = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : '';
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
       
        this.filterDept = this.filterDept && this.filterDept != 'null' ? this.filterDept : null;
        let filterDept = this.filterDept ? this.filterDept : '';
        let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+filterDept;
        this.getModuleList(query);
         let data = { 'departmentId': this.filterDept, 'resortId': ' ' };
                this.roleId != 1 ? data.resortId =  this.filterResort : delete data.resortId;
                this.userService.getUserByDivDept(data).subscribe(result => {
                    if (result && result.data) {
                        this.empList = result.data;
            }
        })
    }
    else if(type == "emp"){
        // console.log(value);
        let query = "&resortId="+this.filterResort+"&divisionId="+this.filterDivision+"&departmentId="+this.filterDept+"&userId="+this.filterUser;
        this.getModuleList(query);
    }

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
            let user = this.utilService.getUserData();
            query = query+'&userId='+user.userId;
        }
       this.commonService.certificateTrendCount(courseTrendObj,query).subscribe((result) => {
         this.trendList = result.data.rows;
         this.totalCount = result.data.count;
       },err=>{
        this.trendList = [];
        this.alertService.error(err.error.error);
       });
   }


     resetFilter(){
       this.filterDivision =null;
       this.filterDept = null;
       this.filterUser = null;
       this.trendsVar.years = '';
       this.trendsVar.months = '';
       this.resortId = this.utilService.getUserData().ResortUserMappings.length ? this.utilService.getUserData().ResortUserMappings[0].Resort.resortId : null;
       this.filterResort = this.resortId;
       this.getModuleList('');
   }





  ngOnDestroy() {
    this.search = '';
  }
  resetSearch() {
    this.search = '';
    this.getTrendCountList();
  }
  // Create PDF
  exportAsPDF() {
    var data = document.getElementById('trendList');
    this.pdfService.htmlPDFFormat(data, this.commonLabels.labels.certifiTrend);
  }
  // Create Excel sheet
  exportAsXLSX(): void {
    this.trendList.map(item => {
      let list = {
        "Course Name": item.courseName,
        "Assigned to (No. of employees)": item.assignedCount,
        "Completion status (No. of employees)": item.completedCount
      };
      this.xlsxList.push(list);
    })
    this.excelService.exportAsExcelFile(this.xlsxList, this.commonLabels.labels.certifiTrend);
  }
  onPrint() {
    window.print();
  }
}
