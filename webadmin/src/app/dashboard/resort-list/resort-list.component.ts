import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,HttpService,CommonService,UserService,UtilService,ResortService,BreadCrumbService,PDFService,ExcelService } from '../../services';
import { ResortVar } from '../../Constants/resort.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CommonLabels } from  '../../Constants/common-labels.var';
import * as _ from "lodash";

@Component({
  selector: 'app-top-resort-list',
  templateUrl: './resort-list.component.html',
  styleUrls: ['./resort-list.component.css'],
})
export class ResortListComponent implements OnInit {

  notificationValue;
  userId;
  resortId;
  resortList = [];
  search;

  constructor( private commonService : CommonService ,
    private alertService: AlertService, 
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public resortVar: ResortVar,
    private headerService: HeaderService,
    public commonLabels : CommonLabels,
    private pdfService:PDFService,
    private excelService:ExcelService,
    public location :Location,
    private utilService :UtilService,
    private breadCrumbService : BreadCrumbService) {
    this.resortVar.url = API_URL.URLS;
  }

  ngOnInit() {
    this.breadCrumbService.setTitle([]);
    this.headerService.setTitle({ title: this.commonLabels.titles.resortmanagement, hidemodule: false });
    this.getResortDetails();
  }

  getResortDetails(){
    let user = this.utilService.getUserData();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = '?resortId='+resortId;
    if(this.search){
      query = '?resortId='+resortId+"&search="+this.search;
    }
    this.commonService.getTopFiveResort(query).subscribe((result) => {  
      if(result && result.isSuccess){
        this.resortList = result.data.rows;
      }
      else{
        this.resortList  = []
      }
    });
  }



  // Create PDF
 exportAsPDF(){ 
  // this.labels.btns.select =  this.labels.btns.pdf;
  var data = document.getElementById('resortList'); 
  this.pdfService.htmlPDFFormat(data,this.commonLabels.titles.resortmanagement);  
} 
// Create Excel sheet
exportAsXLSX():void {
  // this.labels.btns.select =  this.labels.btns.excel;
  this.excelService.exportAsExcelFile(this.resortList, this.commonLabels.titles.resortmanagement);
}
ngOnDestroy(){
  this.search = '';
}
resetSearch(){
  this.search = '';
  this.getResortDetails();
}

onPrint(){
  window.print();
}
}
