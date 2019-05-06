import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {HeaderService} from '../services/header.service';
import { HttpService } from '../services/http.service';
import { ResortService } from '../services/restservices/resort.service';
import { CommonService } from '../services/restservices/common.service';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {ToastrService } from 'ngx-toastr';
import { ResortVar } from '../Constants/resort.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { UtilService } from '../services/util.service';
import { CommonLabels } from '../Constants/common-labels.var'

@Component({
    selector: 'app-resort',
    templateUrl: './resort.component.html',
    styleUrls: ['./resort.component.css'],
})

export class ResortComponent implements OnInit {
    userType ;
    selectedDivision;
    resortId = '';
    resortDetails;
    submitted = false;
    enableEdit = false;
    resortName;
    locationName;
    phoneNumber;
    email;
    status;
    emailValidation = false;
    mobileValidation =  false;
    userId;
    userObj;
    divisionDetails;

   constructor(private alertService: AlertService,private activeRoute:ActivatedRoute,private resortService : ResortService,private commonService:CommonService,private http:HttpService,private location:Location,private resortVar : ResortVar,private utilsService:UtilService,private headerService:HeaderService,private toastr:ToastrService,private router:Router,
    private commonLabels:CommonLabels){
    this.activeRoute.params.subscribe((params:Params)=>{
        this.resortId = params['id'];
    })
    this.resortVar.url = API_URL.URLS;
   }
    
   ngOnInit(){
        let data = this.utilsService.getUserData();
        this.status = null;
        if(data && data.UserRole && data.UserRole[0] &&  data.UserRole[0].roleId){
            this.userType  = data.UserRole[0].roleId;
        }
        if(!this.resortId || this.resortId === undefined || this.resortId === null) {
           
            this.enableEdit = true;
            this.headerService.setTitle({title:this.commonLabels.titles.addresortmagnt, hidemodule:false});
            this.clearData();
        }
        this.selectedDivision = this.resortVar.divisionTemplate[0].division;
        if(this.resortId !== ''){
           this.getResortDetails("add");
        }
   }

   getResortDetails(data){
        this.resortService.getResortById(this.resortId).subscribe((result) => {
            if(result && result.isSuccess){
                this.resortDetails = result.data.rows[0];
                if(data === "add"){
                    this.headerService.setTitle({title:this.resortDetails.resortName, hidemodule:false});
                    this.resortVar.resortName = this.resortDetails.resortName;
                    this.resortVar.location = this.resortDetails.location;
                    this.resortVar.phoneNumber = this.resortDetails.User.phoneNumber;
                    this.resortVar.email = this.resortDetails.User.email;
                    this.resortVar.status = this.resortDetails.status;
                    if(this.userType === 1){
                        this.resortVar.storageSpace = this.resortDetails.utilizedSpace;
                        this.resortVar.status = this.resortDetails.status;
                        this.resortVar.allocatedSpace = this.resortDetails.utilizedSpace;
                    }
                }
                else{
                    this.headerService.setTitle({title:this.resortDetails.resortName, hidemodule:false});
                    this.resortName = this.resortDetails.resortName;
                    this.locationName = this.resortDetails.location;
                    this.phoneNumber = this.resortDetails.User.phoneNumber;
                    this.email = this.resortDetails.User.email;
                    this.status = this.resortDetails.status; 
                    this.emailValidation =true;
                    this.mobileValidation = true;
                    this.userId = this.resortDetails.userId;
                    this.userObj = this.resortDetails.User;
                }
            }
        });
        this.commonService.getResortDivision(this.resortId).subscribe(resp=>{
            if(resp && resp.isSuccess){
                this.divisionDetails = resp.data && resp.data[0].resortMapping && resp.data[0].resortMapping;
            }
        })
   }

   addForm(type) {
        if(type === "division"){
            let obj = {
                division: 1,
                divisionName : ''
            };
            this.resortVar.divisionTemplate.push(obj);
        }
        else if(type === "department"){
            let obj = {
                department: 1,
                departmentName : ''
            };
            this.resortVar.departmentTemplate.push(obj);
        }
    }
    
    removeForm(i,type) {
        if(type === "division"){
            this.resortVar.divisionTemplate.splice(i, 1);
        }
        else if(type === 'department'){
            this.resortVar.departmentTemplate.splice(i, 1);
        }
    }

    back(){
        this.clearData();
        this.location.back();
    }

    editDetails(){
        this.enableEdit=true;
        this.getResortDetails("edit");
    }

    submitResortData(){
        this.submitted = true;
        if(this.resortName && this.locationName && this.email && this.phoneNumber && this.status && this.mobileValidation && this.emailValidation){
           
            if(this.resortId){
                this.userObj.email = this.email;
                this.userObj.phoneNumber = this.phoneNumber;
                let postData = {
                    "resortName" : this.resortName,
                    "email" : this.email,
                    "location" : this.locationName,
                    "phoneNumber":this.phoneNumber,
                    "status":this.status,
                    "roleId" : this.userType,
                    "userId" : this.userId,
                    "User" : this.userObj
                };
                this.resortService.updateResort(this.resortId,postData).subscribe((result)=>{
                    if(result && result.isSuccess){
                        this.clearData();
                        this.toastr.success("Resort updated successfully");
                        this.router.navigateByUrl('/resortslist');
                    }
                },(err)=>{
                    this.alertService.error(err.error.error);
                });
            }
            else{
                let postData = {
                    "resortName" : this.resortName,
                    "email" : this.email,
                    "location" : this.locationName,
                    "phoneNumber":this.phoneNumber,
                    "status":this.status,
                    "roleId" : this.userType
                }
                this.resortService.addResort(postData).subscribe((result)=>{
                    if(result && result.isSuccess){
                        this.clearData();
                        this.toastr.success("Resort added successfully");
                        this.router.navigateByUrl('/resortslist');
                    }
                },(err)=>{
                    this.alertService.error(err.error.error);
                });
            }   
        }    
        else{
            this.alertService.error("Mandatory fields are Required")
        }
    }

    clearData(){
        this.resortVar.resortName = '';
        this.resortVar.location = '';
        this.resortVar.phoneNumber = '';
        this.resortVar.email = '';
        this.resortId = '';
        this.resortVar.storageSpace = '';
        this.resortVar.status = '';
        this.resortVar.allocatedSpace = '';
    }

    validationValueCheck(type){
        if(type === "email"){
            this.emailValidation = this.validationCheck(type,this.email) == "invalidEmail" ? false :true;
        }
        else if(type === "mobile" && this.phoneNumber){
            let data = this.phoneNumber.toString();
            let phoneNum = data.replace("+", "");
            this.mobileValidation = this.validationCheck(type, this.phoneNumber) == "invalidMobile" ? false : true; 
        } 
    }

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

}
