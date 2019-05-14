import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderService,UtilService,CommonService} from '../services';
import { ToastrService } from 'ngx-toastr';
import {SettingVar} from '../Constants/setting.var';
import { Location } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
})

export class SettingsComponent implements OnInit {

    

   constructor(private alertService:AlertService,public location: Location,private headerService:HeaderService,private toastr:ToastrService,private router:Router,public constant:SettingVar,private utilService : UtilService,private commonService : CommonService,public commonLabels:CommonLabels){}

   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
    let userDetails = this.utilService.getUserData();
    this.constant.userId =userDetails.userId; 
    }

   updatePwd(form){
       const formData = form.value;

        if(this.constant.settings.newPwd !== this.constant.settings.confirmPwd){
            this.alertService.error(this.constant.pwdMissmatchMsg);
        }else if(!formData.oldPwd ){
            this.alertService.error(this.constant.oldPwdRequired);
        }
        else if(formData.oldPwd && formData.newPwd){
            let postData = {
                "userId" : this.constant.userId,
                "oldPassword" : formData.oldPwd,
                "newPassword" : formData.newPwd
            }
            console.log(postData)
            this.commonService.passwordUpdate(postData).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.resetData();
                    this.alertService.success(this.constant.pwdUpdateSuccessMsg);
                    this.router.navigateByUrl('/dashboard');
                }
            },err=>{
                this.alertService.error(err.error.error)
            })
        }
    }

    resetData(){
        this.constant.settings.oldPwd = '';
        this.constant.settings.newPwd = '';
        this.constant.settings.confirmPwd = '';
    }

}
