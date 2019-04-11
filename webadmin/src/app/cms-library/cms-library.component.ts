import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,HttpService } from '../services';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from '../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-cms-library',
  templateUrl: './cms-library.component.html',
  styleUrls: ['./cms-library.component.css']
})
export class CMSLibraryComponent implements OnInit {

  constructor(private modalService: BsModalService, private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private headerService: HeaderService) { }
  modalRef;
  videoFile;

  ngOnInit() {
    this.headerService.setTitle({ title: 'CMS Library', hidemodule: false });
    
  }

  openEditModal(template: TemplateRef<any>,modelValue) {
    let modalConfig= {class : "modal-xl"};
    this.modalRef = this.modalService.show(template,modalConfig);
  }
  
}
