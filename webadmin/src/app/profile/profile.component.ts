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
    userDetails:any;
   constructor(private alertService: AlertService,private headerService:HeaderService,private toastr:ToastrService,public profVar: ProfileVar,private router:Router, private datepipe: DatePipe){
   
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
    this.userDetails = JSON.parse(localStorage.getItem('userData'));
    this.profVar.userName=this.userDetails.username;
    this.profVar.email=this.userDetails.emailAddress;
    this.profVar.empId= this.userDetails.employeeId;
    this.profVar.dob= this.datepipe.transform( this.userDetails.dob , 'dd MMM yyyy');
    this.profVar.designation=this.userDetails.designation;
    this.profVar.dept=this.userDetails.department;
    this.profVar.mobile=this.userDetails.phoneNumber;
   }

   onSubmitForm(form){
       if(form.valid){
           let postData=form.value;
           let updatedValue = Object.assign({},this.userDetails,postData);
           localStorage.setItem('userData',JSON.stringify(updatedValue));
          // this.toastr.success(this.profVar.successMsg);
           this.alertService.success(this.profVar.successMsg);
          // this.router.navigateByUrl('/profile');

           
       }
   }


}
