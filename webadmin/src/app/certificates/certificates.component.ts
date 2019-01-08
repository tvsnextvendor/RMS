import { Component,TemplateRef, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { HeaderService} from '../services/header.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService} from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CertificateVar } from '../Constants/certificate.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css'],
})

export class CertificatesComponent implements OnInit {

   modalRef:BsModalRef;
    precentageArray=[];
    percentageTakenError={};
   constructor(private http: HttpService,public constant:CertificateVar,private modalService:BsModalService,private headerService:HeaderService,private toastr:ToastrService,private router:Router,private alertService:AlertService){
       this.constant.url = API_URL.URLS;
   }
   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
    
    //get Template list
    this.http.get(this.constant.url.getTemplateList).subscribe((data) => {
        this.constant.certificateList = data.templatedetails;
    });

    this.getbadgepercentage();
  //   this.http.get(this.constant.url.getBadgePercentage).subscribe((data) => {
  //     this.constant.badgePercentage = data.badgePercentage;
  //  });
 
    // //get course list
    this.http.get(this.constant.url.getCoursesList).subscribe((data) => {
         this.constant.courseList = data.courseDetails;
     });
   }

   getbadgepercentage(){
      this.http.get(this.constant.url.getBadgePercentage).subscribe((data) => {
        this.constant.badgePercentage = data.badgePercentage;
    });
   }

   resetPercentage(){
    this.getbadgepercentage();
    this.constant.gold = null;
    this.constant.diamond=null;
    this.constant.silver=null;
    this.constant.bronze=null;
   }

   badgePercentageUPdate(name,value){
    // this.percentageTaken = false;
    // console.log(name,value);
    // this.precentageArray.push(value);
    // if(this.precentageArray.length){
    //   this.precentageArray.forEach(item=>{
    //     if(item === value){
    //       this.percentageTaken = true;
    //     }
    //   })
    // }
    // let index =  this.constant.badgePercentage.findIndex(x => x.id === parseInt(value) );
    // this.constant.badgePercentage.splice(index,1);
    this.constant.badgePercentage.map(item=>{
      if(item.id === parseInt(value)){
        item.disable = true;
        return item;
      }
    })

   }

   customOptions: any = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      307: {
        items: 2
      },
      614: {
        items: 3
      },
      921: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  }

  
  openAddtemplate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  //Template File Upload
  handleFileInput(files: FileList) {
    this.constant.fileToUpload = files.item(0);
  }

  //dynamic add form
  addForm(){
    let obj={
        course: 1,
        template: 1
    };
   this.constant.templateAssign.push(obj);
  }

  //Assign template to batch
  assignBatchTemplate(form){
    let batchId = this.constant.templateAssign.map(function(item){ return item.program });
    batchId.sort();
    let last = batchId[0]; 
    if(batchId.length > 1){
        for (let i=1; i<batchId.length; i++) {
        if (batchId[i] == last){
          this.alertService.error(this.constant.assignErrMsg);
           // this.toastr.error(this.constant.assignErrMsg);
        }else{
            let postData = this.constant.templateAssign;
            this.alertService.success(this.constant.assignSuccessMsg);
            //this.toastr.success(this.constant.assignSuccessMsg);
            this.clearAssignTemplate();
        }
        last = batchId[i];
        }
   }else{
        let postData = this.constant.templateAssign;
        this.alertService.success(this.constant.assignSuccessMsg);
        //this.toastr.success(this.constant.assignSuccessMsg);
   }
  }
  
  //Reset Form
  clearAssignTemplate(){
   this.constant.templateAssign=[{
        course: 1,
        template: 2
      }];  
  }

  clearMessage(){
    this.clearAssignTemplate();
  }

  removeForm(i){
    this.constant.templateAssign.splice(i, 1);   
  }
 
  //Add Certificate Template
  onSave(form){
  if(form.valid){    
   if(this.constant.fileToUpload){
       let postData={
           templatename : form.templateName,
           htmlfile : this.constant.fileToUpload
     }
     this.alertService.success(this.constant.uploadSuccessMsg);
     // this.toastr.success(this.constant.uploadSuccessMsg);
      this.modalRef.hide();
   }else{
     //  this.toastr.error(this.constant.uploadErrMsg);
       this.alertService.error(this.constant.uploadErrMsg);
   }
  }


  }

 




  
}
