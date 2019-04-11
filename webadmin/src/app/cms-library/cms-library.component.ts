import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {

  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
  modalRef;
  videoFile;
  enableEdit = false;
  enableDuplicate = false;;
  enableView = false;;
  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    
  }

  openEditModal(template: TemplateRef<any>,modelValue) {
    let modalConfig= {class : "modal-xl"};
    this.modalRef = this.modalService.show(template,modalConfig);
  }
  enableDropData(type){
    console.log(type);
    if(type === "view"){
      this.enableView = !this.enableView;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "closeDuplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "closeEdit"){
      this.enableView = false;
      this.enableEdit = false;
      this.enableDuplicate = false;
    }
    else if(type === "edit"){
      this.enableView = false;
      this.enableEdit = true;
      this.enableDuplicate = false;

    }
    else if(type === "duplicate"){
      this.enableView = true;
      this.enableEdit = false;
      this.enableDuplicate = true;
    }
  }
}
