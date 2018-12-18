import { Component,TemplateRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderService} from '../services/header.service';
import { ToastrService } from 'ngx-toastr';
import {HttpService} from '../services/http.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CertificateVar } from '../Constants/certificate.var';
import { API_URL } from '../Constants/api_url';

@Component({
    selector: 'app-certificates',
    templateUrl: './certificates.component.html',
    styleUrls: ['./certificates.component.css'],
})

export class CertificatesComponent implements OnInit {

    modalRef:BsModalRef;
    certificateList;
    batchList;
    fileToUpload: File = null;
    // template= 1;
    // batch= 1;
    templateAssign : any[]=[{
       batch: 1,
       template: 2
     }
    ]


   constructor(private http: HttpService,private constant:CertificateVar,private modalService:BsModalService,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
       this.constant.url = API_URL.URLS;
   }
   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
    
    //get Template list
    this.http.get(this.constant.url.getTemplateList).subscribe((data) => {
        this.certificateList = data.templateList;
    });
 
    //get Batch list
    this.http.get(this.constant.url.getBatchList).subscribe((data) => {
        this.batchList = data.batchList;
    });
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

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);;
  }

  addModule(){
    let obj={
        batch: 1,
        template: 1
    };
   this.templateAssign.push(obj);
  }

  submitForm(form){
    console.log(this.templateAssign,"MODULEFORM");
  }
    
  removeModule(i){
    this.templateAssign.splice(i, 1);   
    console.log(this.templateAssign,"MODULEREMOVE");
 
  }
 
  //Add Certificate Template
  onSave(form){
  if(form.valid){    
   if(this.fileToUpload){
       let postData={
           templateName : form.templateName,
           file : this.fileToUpload
     }
      this.toastr.success(this.constant.uploadSuccessMsg);
      this.modalRef.hide();
   }else{
       this.toastr.error(this.constant.uploadErrMsg);
   }
  }


  }

 




  
}
