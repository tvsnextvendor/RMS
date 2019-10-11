import { Component, OnInit } from '@angular/core';
import { CommonService, BreadCrumbService, HeaderService, UtilService,PDFService,ExcelService } from '../services';
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
  search='';
  trendList = [];
  xlsxList =[];
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
  
  constructor(public location: Location, private commonService: CommonService, public commonLabels: CommonLabels,private excelService: ExcelService,private pdfService:PDFService,private breadCrumbService: BreadCrumbService, private headerService: HeaderService, private utilService: UtilService,public trendsVar: VideosTrendVar) {
    this.pageLimitOptions = [5, 10, 25];
    this.pageLimit = [this.pageLimitOptions[0]];
    this.roleId = this.utilService.getRole();
      // added employee div Drop Down
      this.divIds =this.utilService.getDivisions() ? this.utilService.getDivisions() :'';
      this.deptIds =this.utilService.getDepartment() ? this.utilService.getDepartment() :'';
  }
  ngOnInit() {
    this.setDivIds = (this.divIds.length > 0)?this.divIds.join(','):'';
    this.setDeptIds = (this.deptIds.length > 0)?this.deptIds.join(','):'';
    this.headerService.setTitle({ title: this.commonLabels.labels.certifiTrend, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.resortId = this.utilService.getUserData() && this.utilService.getUserData().ResortUserMappings.length && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
    this.getTrendCountList();
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
    let query = this.resortId ? "?resortId=" + this.resortId + "&search=" + this.search  : (this.search != '' ? "?search=" + this.search  : '');
    query+= (this.setDivIds && this.roleId == 4)?'&divIds='+this.setDivIds:'';
    query+= (this.setDeptIds && this.roleId == 4)?'&departmentIds='+this.setDeptIds:'';
    this.commonService.certificateTrendCount(query).subscribe((res) => {
      if (res.isSuccess) {
        this.trendList = res.data.rows.length ? res.data.rows : [];
        this.totalCount = res.data.count;
      } else {
        this.trendList = [];
      }
    });
  }

  ngOnDestroy() {
    this.search = '';
  }
  resetSearch() {
    this.search = '';
    this.getTrendCountList();
  }
  
  // Create PDF
  exportAsPDF(){ 
    var data = document.getElementById('trendList'); 
    this.pdfService.htmlPDFFormat(data,this.commonLabels.labels.certifiTrend);  
  }

  // Create Excel sheet
  exportAsXLSX():void {
    this.trendList.map(item=>{
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
