import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {HttpService,CommonService} from '../services';
import { CommonLabels } from '../Constants/common-labels.var';
import { AlertService } from '../services/alert.service';


@Component({
  selector: 'app-reset',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class ResetpasswordComponent implements OnInit {

  resetFormData = {
    userId: '',
    newpassword:'',
    confirmpassword:''  
  };
  confirmPwd = '';
  userArray = [];
  userId;

  constructor(private alertService:AlertService ,
    private route: ActivatedRoute,
    private router: Router, 
    private toastr: ToastrService,
    public http : HttpService,
    private commonService :CommonService,
    public commonLabels : CommonLabels) { }

  ngOnInit() {
    let encId = this.route.snapshot && this.route.snapshot.params && this.route.snapshot.params.id;
    this.userId = (encId);
  }
// reset function
  submitResetPassword() {
    if (this.resetFormData.newpassword === this.resetFormData.confirmpassword)
    {
      let params = {
        "userId": this.userId,
        "password":this.resetFormData.newpassword
        }
      this.commonService.resetPassword(params).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.router.navigateByUrl('/login');
          this.alertService.success(resp.message);
        }
      },err=>{
        console.log(err.error.error);
      })
    } else {
      this.alertService.error('Password Mismatch');
    }
  }
}
