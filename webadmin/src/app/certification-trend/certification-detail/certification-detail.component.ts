import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService, BreadCrumbService, HeaderService, UtilService,PDFService, ExcelService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
  selector: 'app-certification-detail',
  templateUrl: './certification-detail.component.html',
  styleUrls: ['./certification-detail.component.css']
})
export class CertificationDetailComponent implements OnInit {
 
 courseId;
 badgeList=[];
 resortId;
 search='';
 totalLength;
 pageTitle;
 totalCount;
 xlsxList=[];
 roleId;
 userId;
 
  constructor(public activatedRoute: ActivatedRoute,private commonService: CommonService, public commonLabels: CommonLabels, private breadCrumbService: BreadCrumbService, private headerService: HeaderService, private utilService: UtilService,private pdfService:PDFService, private excelService:ExcelService) { 
    this.activatedRoute.params.subscribe((params: Params) => {
        this.courseId = params.id ? params.id : '';
    });
  
  }
  ngOnInit() {
    this.headerService.setTitle({ title: this.commonLabels.labels.certifiTrend, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    this.roleId = this.utilService.getRole();
    this.userId = this.utilService.getUserData().userId;
    this.resortId = this.utilService.getUserData() && (this.utilService.getUserData().ResortUserMappings[0])?this.utilService.getUserData().ResortUserMappings[0].Resort.resortId:'';
    this.getBadgeList();
  }
  getBadgeList(){
     let query={
       courseId : this.courseId,
       resortId : this.resortId,
       search : this.search,
       userId :(this.roleId === 4)? this.userId:''
      }
      
    this.commonService.certificateTrendCountDetail(query).subscribe((res) => {
        if (res.isSuccess) {
            this.badgeList = res.data.rows.length ? res.data.rows : [];
            this.totalCount = res.data.rows.length;
            this.pageTitle = res.data.course.courseName;
        } else {
            this.badgeList = [];
        }
    });
  }
  // Create PDF
  exportAsPDF(){ 
    var data = document.getElementById('certificationDetail'); 
    this.pdfService.htmlPDFFormat(data,this.pageTitle);  
  }

    // // Create Excel sheet
    // exportAsXLSX():void {
    //   this.badgeList.map(item=>{
    //       let list = {
    //         "User Name": item.userName,
    //         "Score": this.calculateAvgScore(item.CertificateUserMappings),
    //         "Training class": item.completedCount,
    //         "Badge received"
    //       };
    //     this.xlsxList.push(list);
    //   })
    //   this.excelService.exportAsExcelFile(this.xlsxList, this.pageTitle);
    // }

  calculateAvgScore(data){
   var score = 0;
   var avgScore = 0;
   var totalLength = 0;
    data.map(item=>{
      totalLength = data.length;
      score += parseInt(item.TrainingClass.FeedbackMappings[0].passPerc);
    })

    avgScore = score / totalLength;
    return avgScore;
  }

  onPrint() {
    window.print();
  }

}
