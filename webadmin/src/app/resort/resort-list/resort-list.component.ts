import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,HttpService,CommonService,UserService,UtilService,ResortService,PDFService,ExcelService,BreadCrumbService } from '../../services';
import { ResortVar } from '../../Constants/resort.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CommonLabels } from  '../../Constants/common-labels.var';
import * as _ from "lodash";

@Component({
  selector: 'app-resort-list',
  templateUrl: './resort-list.component.html',
  styleUrls: ['./resort-list.component.css'],
})
export class ResortListComponent implements OnInit {

  notificationValue;
  userId;
  resortId;

  constructor(private modalService: BsModalService, private commonService : CommonService ,private userService:UserService,private http: HttpService, 
    private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public resortVar: ResortVar,
     private headerService: HeaderService,private utilService : UtilService,private resortService : ResortService,public commonLabels : CommonLabels,
     private pdfService:PDFService,private excelService:ExcelService,private breadCrumbService :BreadCrumbService) {
    this.resortVar.url = API_URL.URLS;
  }

  ngOnInit() {
    
    this.headerService.setTitle({ title: this.commonLabels.titles.resortmanagement, hidemodule: false });
    this.breadCrumbService.setTitle([]);
    let data = this.utilService.getUserData();
    this.getResortDetails();
        if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
            this.userId  = data.UserRole[0].roleId;
        }
  }

  getResortDetails(){
    let data = this.utilService.getUserData();
    this.commonService.getResortList(data.userId).subscribe((result) => {  
      if(result && result.isSuccess){
        this.resortVar.resortList = result.data.rows;
      }
      else{
        this.resortVar.resortList  = []
      }
    });
  }

  resortDetails(id){
    this.route.navigateByUrl('/resorts/'+id);
  }

  statusUpdate(i,resortId,status){
    this.resortVar.resortList[i].status = status === 'Active' ? 'InActive' : 'Active';
    let params ={
      status : status === 'Active' ? 'InActive' : 'Active'
    }
    this.resortService.updateResort(resortId,params).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.getResortDetails();
        this.alertService.success('Resort status updated successfully');
      }
    })
  }
  deleteResortAPI(){
    this.resortService.deleteResort(this.resortId).subscribe(resp=>{
     // if(resp && resp.isSuccess){
        this.getResortDetails();
        this.alertService.success(resp.message);
        this.resortVar.modalRef.hide();
      //}
    });

  }

  removeResort(template: TemplateRef<any>,resortId, i) {
    let modalConfig={
        class : "modal-dialog-centered"

    }
    this.resortId= resortId;
    this.resortVar.modalRef = this.modalService.show(template,modalConfig); 
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
  let arr = this.resortVar.resortList.map(item=>_.pick(item,['resortId','resortName','location','status','totalNoOfUsers','totalStorage','allocatedSpace']));
  this.resortVar.resortList.forEach((data,i)=>{
    arr[i].email = data.ResortUserMappings.length && data.ResortUserMappings[0].User.email;
    arr[i].phoneNumber = data.ResortUserMappings.length && data.ResortUserMappings[0].User.phoneNumber;
  })
  this.excelService.exportAsExcelFile(arr, this.commonLabels.titles.resortmanagement);
}
}
