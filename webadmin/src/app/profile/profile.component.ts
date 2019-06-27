import { Component, OnInit} from '@angular/core';
import {HeaderService,UtilService,UserService,BreadCrumbService,CommonService} from '../services';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ProfileVar} from '../Constants/profile.var';
import {ToastrService } from 'ngx-toastr';
import { AlertService } from '../services/alert.service';
import { CommonLabels } from '../Constants/common-labels.var';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
    userDetails:any;
    validEmail;
    validPhone = false;
    submitted = false;
    reportingTo;
    departmentId;
    designationId;
    divisionId;
    userId;
    profilePic;
    previewProfilePic;
    profileFile;

   constructor(private alertService: AlertService,private headerService:HeaderService,private toastr:ToastrService,public profVar: ProfileVar,private router:Router, private datepipe: DatePipe,public commonLabels:CommonLabels,private utilService : UtilService,private userService : UserService,private breadCrumbService :BreadCrumbService,private commonService : CommonService){
   
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
    this.headerService.setTitle({title:this.commonLabels.titles.profile, hidemodule:false});
    this.breadCrumbService.setTitle([]);
    this.previewProfilePic = "assets/images/profile_circle.png";
    this.getProfile();
   }
  
   getProfile(){
    this.userDetails = this.utilService.getUserData();
    this.profVar.userName=this.userDetails.userName;
    this.userId = this.userDetails.userId;
    this.profVar.email=this.userDetails.email;
    this.profVar.empId= this.userDetails.employeeId;
    this.previewProfilePic = this.userDetails.uploadPaths && this.userDetails.uploadPaths.uploadPath && this.userDetails.userImage ? this.userDetails.uploadPaths.uploadPath+this.userDetails.userImage : 'assets/images/profile_circle.png';
    // this.profVar.dob= this.datepipe.transform( this.userDetails.dob , 'dd MMM yyyy');
    this.profVar.designation=this.userDetails.Designation && this.userDetails.Designation.designationName;
    this.profVar.dept= this.userDetails.Department && this.userDetails.Department.departmentName;
    this.profVar.mobile=this.userDetails.phoneNumber;
    this.departmentId = this.userDetails.departmentId;
    this.divisionId = this.userDetails.divisionId;
    this.designationId = this.userDetails.designationId;
    this.reportingTo = this.userDetails.reportingTo;
   }

   onSubmitForm(form){
       if(form.valid){
           this.submitted = true;
           let postData=form.value;
           let obj = {
                userName : this.profVar.userName,
                email : this.profVar.email,
                phoneNumber : this.profVar.mobile,
                designationId:this.designationId,
                divisionId:this.divisionId,
                departmentId:this.departmentId,
                reportingTo:this.reportingTo,
                accessTo: 'web',
            };
           if(this.profVar.userName && this.profVar.mobile && this.profVar.email && !this.validPhone){
                this.userService.updateUser(this.userId,obj).subscribe(resp=>{
                    if(resp && resp.isSuccess){
                        this.router.navigateByUrl('/profile');
                        this.userDetails.userName = this.profVar.userName;
                        this.userDetails.email = this.profVar.email;
                        this.userDetails.phoneNumber =  this.profVar.mobile;
                        localStorage.removeItem("userData");
                        localStorage.setItem('userData',btoa(JSON.stringify(this.userDetails)));
                        this.alertService.success(this.commonLabels.msgs.profilesuccess);
                    }
                })
           }
           else{
               this.alertService.error(this.commonLabels.mandatoryLabels.profileMandatory)
           }
       }
   }

   validationUpdate(type) {
    if (type === "email") {
        this.validEmail = this.profVar.email && this.validationCheck("email", this.profVar.email) === 'invalidEmail' ? true : false;
    }
    else if (type === "mobile") {
        this.validPhone = this.profVar.mobile && this.validationCheck("mobile",this.profVar.mobile) === 'invalidMobile' ? true : false;
    }
    else {
        this.validEmail = this.profVar.email && this.validationCheck("email", this.profVar.email) === 'invalidEmail' ? true : false;
        this.validPhone = this.profVar.mobile && this.validationCheck("mobile", this.profVar.mobile)  === 'invalidMobile' ? true : false;
    }
}

// email and mobile number validation check
validationCheck(type, value) {
    if (type === "email") {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(value)) {
            return "invalidEmail"
        }
    }
    if (type === "mobile") {
        let data = value.toString();
        let phoneNum = data.replace("+", "");
        let mobileRegex = /^(\d{10}|\d{11}|\d{12})$/;         
         if (!(value.match(mobileRegex))) {
            return "invalidMobile"
        }
    }
}

fileUpload(e){
    let reader = new FileReader();
    let fileName;
    if (e.target && e.target.files[0]) {
        let file = e.target.files[0];
        this.profileFile = file;
        reader.onloadend = () => {
            this.previewProfilePic = reader.result;
        }
        reader.readAsDataURL(file);
    }
    this.commonService.uploadFiles(this.profileFile).subscribe((result) => {
        if(result && result.isSuccess){
            fileName = result.data && result.data.length ? result.data[0].filename : '';
            if(fileName){
                let obj ={userImage : fileName}
                this.userService.updateUser(this.userId,obj).subscribe(resp=>{
                    console.log(resp)
                    if(resp && resp.isSuccess){
                        let data = resp.data && resp.data.user;
                        this.userDetails.userImage = data && data.userImage;
                        this.userDetails.uploadPaths = resp.data && resp.data.uploadPaths;
                        localStorage.removeItem("userData");
                        localStorage.setItem('userData',btoa(JSON.stringify(this.userDetails)));
                        this.getProfile();
                        this.alertService.success(this.commonLabels.msgs.profilesuccess);
                    }
                })
            }
        }
    })
}
}
