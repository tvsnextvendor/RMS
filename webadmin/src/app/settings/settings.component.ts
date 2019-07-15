import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderService,UtilService,CommonService,BreadCrumbService} from '../services';
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

    

   constructor(private alertService:AlertService,public location: Location,private headerService:HeaderService,private toastr:ToastrService,private router:Router,public constant:SettingVar,private utilService : UtilService,private commonService : CommonService,public commonLabels:CommonLabels,private breadCrumbService :BreadCrumbService){}

   ngOnInit(){
    this.headerService.setTitle({ title:this.commonLabels.titles.settings, hidemodule: false});
    this.breadCrumbService.setTitle([]);
    let userDetails = this.utilService.getUserData();
    this.constant.userId =userDetails.userId; 
    }

   updatePwd(form){
       const formData = form.value;

        if(this.constant.settings.newPwd !== this.constant.settings.confirmPwd){
            this.alertService.error(this.commonLabels.labels.pwdMissmatchMsg);
        }else if(!formData.oldPwd ){
            this.alertService.error(this.commonLabels.mandatoryLabels.oldPwdRequired);
        }
        else if(formData.oldPwd && formData.newPwd){
            let postData = {
                "userId" : this.constant.userId,
                "oldPassword" : formData.oldPwd,
                "newPassword" : formData.newPwd
            }
            // console.log(postData)
            this.commonService.passwordUpdate(postData).subscribe(resp=>{
                if(resp && resp.isSuccess){
                    this.resetData();
                    this.alertService.success(this.commonLabels.msgs.pwdUpdateSuccess);
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
