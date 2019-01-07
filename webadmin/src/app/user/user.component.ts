import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { UserVar } from '../Constants/user.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';


@Component({
    selector: 'app-users',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
})

export class UserComponent implements OnInit {

   editEnable = false;
   userName;
   userId;
   department;
   designation;
   emailAddress;
   phoneNumber;
   userIndex;
   pageLimitOptions = [];
   pageLimit;
   labels;
   videoSubmitted = false;
   message;
   validPhone = false;
   validEmail = false;
   validUserId = false;
   departmentArray = [];
   designationArray = [];
   designationData = [];
   fileUploadValue;

   constructor(private alertService:AlertService,private http: HttpService,public constant:UserVar,private headerService:HeaderService,private toastr:ToastrService,private router:Router){
        this.constant.url = API_URL.URLS;
        this.labels  = constant.labels;
   }
    ngOnInit(){
        this.headerService.setTitle({ title:this.constant.title, hidemodule: false});
        this.pageLimitOptions = [5, 10, 25];
        this.pageLimit=[this.pageLimitOptions[1]];
        
        //get Users list
        this.http.get(this.constant.url.getUsersList).subscribe((data) => {
            if(data['isSuccess']){
                this.constant.userList = data.UserDetails.map(item=>{
                    item.editEnable = false;
                    return item;
                });
            }
        });

        this.http.get(this.constant.url.getDepartments).subscribe((resp) => {
            if(resp['isSuccess']){
                this.departmentArray = resp.DepartmentList;
                // console.log(this.departmentArray)
            }
          });
        this.http.get(this.constant.url.getDesignations).subscribe((resp) => {
            if(resp['isSuccess']){
                this.designationArray = resp.DesignationList;
                // console.log(this.departmentArray)
            }
        });
    }

   //update user
    userEdit(data,index){
        if(!this.editEnable){       
            this.constant.userList[index].editEnable =true;
            this.editEnable = true;
            this.userIndex = index;
            this.userName = data.employeeName;
            this.userId = data.employeeId;
            this.department = data.department;
            // this.designation = data.designation;
            this.emailAddress = data.emailId;
            this.phoneNumber = data.mobile;
            this.videoSubmitted = false;
            this.designationUpdate(data.department,data.designation);
        }
        else{
            // this.toastr.warning(this.labels.updateRestrictMsg);
            this.alertService.error(this.labels.updateRestrictMsg);
        }
    }

    designationUpdate(data,designation){
        // console.log(data,this.department,designation);
        this.designation = '';
        this.department = data !== "null" ? data : '';
        this.designationArray.forEach(item=>{
            if(data === item.name){
                this.designationData = item.designations;
            }
        })
        if(designation){
            this.designation = designation;
        }   
    }

   //add new user
    addUser(){
        this.videoSubmitted = false;
        // this.editEnable = false;
        if(!this.editEnable){
            let obj = { 
                "department": "",
                "designation": "",
                "emailId": "",
                "mobile": "",
                "DOB" : "",
                "employeeId": "",
                "employeeName": "",
                "editEnable" : true,
            }
            this.constant.userList.push(obj);
            this.editEnable = true;
            this.constant.userList = _.orderBy(this.constant.userList, ['employeeId'],['asc'])
            this.resetFields();
        }
        else{
           // this.toastr.warning(this.labels.addRestrictMsg);
           this.alertService.error(this.labels.addRestrictMsg);
        }
    }

   //reset
    resetFields(){
        this.userName = '';
        this.userId = '';
        this.department = '';
        this.designation = '';
        this.emailAddress = '';
        this.phoneNumber = '';
    }

   //cancel update
    cancelEdit(data,index){
        this.videoSubmitted = false;
        if(data.employeeId === ''){
            // let i = this.constant.userList.length - 1;
            this.constant.userList.splice(0,1);
        }
        else{
            this.constant.userList[index].editEnable =false;
        }
        this.editEnable = false;
    }

    //delete user
    removeUser(data,i){
        if(this.constant.userList.length){
            let index = this.constant.userList.findIndex(x=>x.employeeId === data.employeeId);
            this.constant.userList.splice(index,1);
            this.message = (data.employeeName + this.labels.removeUser);
            this.alertService.success(this.message);
        }
    }

    //user update submit
    userUpdate(data,index){
        this.videoSubmitted = true;
        this.validationUpdate("submit");
        if(this.userId && this.userName && this.department && this.designation && this.emailAddress && !this.validEmail && this.phoneNumber && !this.validPhone && !this.validUserId){
            let i = data.employeeId === '' ? ('0') : this.constant.userList.findIndex(x=>x.employeeId === data.employeeId);
            this.constant.userList[i]={
                "employeeId" : this.userId,
                "employeeName" :  this.userName ,
                "department" : this.department,
                "designation" : this.designation,
                "emailId" : this.emailAddress,
                "DOB" : this.constant.userList[i].DOB,
                "mobile" : this.phoneNumber,
                "editEnable" : false
            };
            this.editEnable = false;
            this.videoSubmitted = false;
            this.userIndex = '';
            this.resetFields();
            this.message = data.employeeId === '' ? (this.labels.userAdded) : (this.labels.userUpdated);
            this.constant.userList = _.orderBy(this.constant.userList, ['employeeId'],['asc'])
            this.alertService.success(this.message);
        }
        // else if(!validEmail){
        //     this.toastr.error(this.labels.emailError);
        // }
        // else if(!validPhone){
        //         this.toastr.error(this.labels.mobileError);
        // }
        // else{
        //     this.toastr.error(this.labels.mandatoryFields);
        // }
    }

    validationUpdate(type){
        if(type === "email"){
            this.validEmail = this.emailAddress && this.validationCheck("email",this.emailAddress) === 'invalidEmail' ? true : false;
        }
        else if(type === "mobile"){
            this.validPhone = this.phoneNumber && this.validationCheck("mobile",this.phoneNumber) ? false : true;
        }
        else if(type === "userId"){
            let idCheck = this.constant.userList.find(x=>x.employeeId === this.userId);
            let editIndexCheck =  this.constant.userList.findIndex(x=>x.employeeId === this.userId)
            console.log(this.userIndex,editIndexCheck);
            debugger;
            this.validUserId = idCheck ? ( this.userIndex === editIndexCheck ? false : true) : false;
        }
        else{
            this.validEmail = this.emailAddress && this.validationCheck("email",this.emailAddress) === 'invalidEmail' ? true : false;
            this.validPhone = this.phoneNumber && this.validationCheck("mobile",this.phoneNumber) ? false : true;
            let idCheck = this.constant.userList.find(x=>x.employeeId === this.userId);
            let editIndexCheck =  this.constant.userList.findIndex(x=>x.employeeId === this.userId)
            debugger;
            this.validUserId = idCheck ? (this.userIndex === editIndexCheck ? false : true) : false;
        }
        
        
    }
    // email and mobile number validation check
    validationCheck(type,value){
        if(type === "email"){
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!emailRegex.test(value)){
                return "invalidEmail"
            }
        }     
        if(type === "mobile"){
            let data = value.toString(); 
            let phoneNum =  data.replace("+","");
            let phoneNumValid = phoneNum ? (phoneNum.length === 10 ? true :false) : false;
            return phoneNumValid
        }
    }

    messageClose(){
        this.message = '';
        // console.log("messege redsad")
      }
}
