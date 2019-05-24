import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,HttpService,CommonService,UserService,UtilService,ResortService,PDFService,ExcelService } from '../../services';
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
  resortList;

  constructor(private modalService: BsModalService, private commonService : CommonService ,private userService:UserService,private http: HttpService, 
    private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public resortVar: ResortVar,
     private headerService: HeaderService,private utilService : UtilService,private resortService : ResortService,public commonLabels : CommonLabels,private pdfService:PDFService,private excelService:ExcelService) {
    this.resortVar.url = API_URL.URLS;
  }

  ngOnInit() {
    
    this.headerService.setTitle({ title: this.commonLabels.titles.resortmanagement, hidemodule: false });
    this.getResortDetails();
  }

  getResortDetails(){
    let query = '';
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
}
