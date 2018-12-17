import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderService} from '../services/header.service';
import { ToastrService } from 'ngx-toastr';
import {SettingVar} from '../Constants/setting.var';
import { Location } from '@angular/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
})

export class SettingsComponent implements OnInit {

    settings: any = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: '',
    };

   constructor(private location: Location,private headerService:HeaderService,private toastr:ToastrService,private router:Router,private constant:SettingVar){}

   ngOnInit(){
    this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
   }
   updatePwd(){
    if(this.settings.newPwd !== this.settings.confirmPwd){
        this.toastr.error(this.constant.pwdMissmatchMsg);
    }else{
        this.toastr.success(this.constant.pwdUpdateSuccessMsg);
        this.router.navigateByUrl('/dashboard');
    }
    }

}
