import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService,HttpService,CommonService,UserService,UtilService,ResortService } from '../../services';
// import { HttpService } from '../../services/http.service';
// import { CommonService } from '../../services/restservices/common.service';
// import { UserService } from '../../services/restservices/user.service';
import { ToastrService } from 'ngx-toastr';
import { ResortVar } from '../../Constants/resort.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from 'src/app/services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
// import { AddBatchComponent} from '../../batch/add-batch/add-batch.component';
import { CommonLabels } from  '../../Constants/common-labels.var';

@Component({
  selector: 'app-resort-list',
  templateUrl: './resort-list.component.html',
  styleUrls: ['./resort-list.component.css'],
})
export class ResortListComponent implements OnInit {

  notificationValue;
  userId;
  resortId;

  constructor(private modalService: BsModalService, private commonService : CommonService ,private userService:UserService,private http: HttpService, private alertService: AlertService, private route: Router, private activatedRoute: ActivatedRoute, public resortVar: ResortVar, private toastr: ToastrService, private headerService: HeaderService,private utilService : UtilService,private resortService : ResortService,public commonLabels : CommonLabels) {
    this.resortVar.url = API_URL.URLS;
  }

  ngOnInit() {
    
    this.headerService.setTitle({ title: this.commonLabels.titles.resortmanagement, hidemodule: false });
    this.getResortDetails();
    let data = this.utilService.getUserData();
        if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
            this.userId  = data.UserRole[0].roleId;
        }
  }

  getResortDetails(){
    this.commonService.getResortList().subscribe((result) => {  
      if(result ){
        this.resortVar.resortList = result.data.rows;
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


}
