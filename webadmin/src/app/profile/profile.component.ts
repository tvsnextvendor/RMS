import { Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header.service';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ProfileVar} from '../Constants/profile.var';
import {ToastrService } from 'ngx-toastr';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

   constructor(private alertService: AlertService,private headerService:HeaderService,private toastr:ToastrService,private profVar: ProfileVar,private router:Router, private datepipe: DatePipe){
    
    const currentUrl = this.router.url;
    this.profVar.split_url= currentUrl.split('/');
    
    if(this.profVar.split_url[1]== 'editprofile'){
        this.profVar.hideProfile=true;
        this.profVar.hideEditProfile=false;
    }else{
        this.profVar.hideEditProfile=true;
        this.profVar.hideProfile=false;
    }
   }
    
   ngOnInit(){
    this.headerService.setTitle({title:this.profVar.title, hidemodule:false});
    this.getProfile();
   }
  
   getProfile(){
    const userDetails =  JSON.parse(localStorage.getItem('user'));
    this.profVar.userName=userDetails.username;
    this.profVar.email=userDetails.emailAddress;
    this.profVar.dob= this.datepipe.transform( userDetails.dob , 'dd MMM yyyy');
    this.profVar.designation=userDetails.designation;
    this.profVar.dept=userDetails.department;
    this.profVar.mobile=userDetails.phoneNumber;
   }

   onSubmitForm(form){
       if(form.valid){
           let postData=form.value;
           //this.toastr.success(this.profVar.successMsg);
           this.alertService.success(this.profVar.successMsg);
           this.router.navigateByUrl('/profile');
       }
   }


}
