import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { CommonService } from '../../services/restservices/common.service';
import { UserService } from '../../services/restservices/user.service';
import { ToastrService } from 'ngx-toastr';
import { ResortVar } from '../../Constants/resort.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// import { AddBatchComponent} from '../../batch/add-batch/add-batch.component';

@Component({
  selector: 'app-resort-list',
  templateUrl: './resort-list.component.html',
  styleUrls: ['./resort-list.component.css'],
})
export class ResortListComponent implements OnInit {

  notificationValue;

  constructor(private modalService: BsModalService, private commonService : CommonService ,private userService:UserService,private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public resortVar: ResortVar, private toastr: ToastrService, private headerService: HeaderService) {
    this.resortVar.url = API_URL.URLS;
  }

  ngOnInit() {
    this.resortVar.title = "Resort Management";
    this.headerService.setTitle({ title: this.resortVar.title, hidemodule: false });
   
    this.commonService.getResortList().subscribe((result) => {  
      if(result ){
        this.resortVar.resortList = result.data.rows;
      
      }
    });
  }

  resortDetails(id){
    this.route.navigateByUrl('/resorts/'+id);
  }
}
