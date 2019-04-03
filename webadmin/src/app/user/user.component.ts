import { Component,TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { UserVar } from '../Constants/user.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UtilService  } from '../services/util.service';
import * as XLSX from 'ts-xlsx';
import {UserService} from '../services/requestservices/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

    userName;
    userId;
    department = "";
    designation = "";
    division = "";
    reportingTo = "";
    emailAddress;
    phoneNumber;
    userIndex;
    pageLimitOptions = [];
    pageLimit;
    labels;
    message;
    editEnable= false;
    validPhone = false;
    validEmail = false;
    validUserId = false;
    defaultSetting=false;
    departmentArray = [];
    designationArray = [];
    divisionArray=[];
    designationData = [];
    fileUploadValue;
    arrayBuffer: any;

    constructor(private alertService: AlertService, private utilService: UtilService, private userService:UserService ,private http: HttpService,private modalService : BsModalService,  public constant: UserVar, private headerService: HeaderService, private toastr: ToastrService, private router: Router) {
        this.constant.url = API_URL.URLS;
        this.labels = constant.labels;
    }
    ngOnInit() {
        this.headerService.setTitle({ title: this.constant.title, hidemodule: false });
        this.pageLimitOptions = [5, 10, 25];
        this.pageLimit = [this.pageLimitOptions[1]];

        //get Users list
        this.http.get(this.constant.url.getUsersList).subscribe((data) => {
            if (data['isSuccess']) {
                this.constant.userList = data.UserDetails.map(item => {
                    return item;
                });
            }
        });

        this.userService.getUser().subscribe((result)=>{
          //  console.log(data);
        });

        this.http.get(this.constant.url.getDepartments).subscribe((resp) => {
            if (resp['isSuccess']) {
                this.departmentArray = resp.DepartmentList;
                // console.log(this.departmentArray)
            }
        });

      this.http.get(this.constant.url.getDivision).subscribe((resp) => {
            if (resp['isSuccess']) {
                this.divisionArray = resp.divisionList;
                // console.log(this.departmentArray)
            }
        });

        this.http.get(this.constant.url.getDesignations).subscribe((resp) => {
            if (resp['isSuccess']) {
                this.designationArray = resp.DesignationList;
                // console.log(this.departmentArray)
            }
        });
    }

    //update user
    userEdit(data, index) {
            this.editEnable= true;
            this.userIndex = index;
            this.userName = data.employeeName;
            this.userId = data.employeeId;
            this.department = data.department;
            this.division = data.division;
            this.emailAddress = data.emailId;
            this.phoneNumber = data.mobile;
            this.designationUpdate(data.department, data.designation);
    }

    designationUpdate(data, designation) {
        console.log(data, designation , "DESIGNATION");
        if (data == "") {
            this.designationData = [];
        }
        this.designation = '';
        this.department = data !== "null" ? data : '';
        this.designationArray.forEach(item => {
            if (parseInt(data) === item.id) {
                this.designationData = item.designations;
            }
        })
        if (designation) {
            this.designation = designation;
        }
    }


    closeAddForm() {
        this.resetFields();
        this.constant.modalRef.hide();
    }


    openAddUser(template: TemplateRef<any>, data,  index) {
        if(data){
         this.userEdit(data,index);
         this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }else{
         this.resetFields();   
         this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }
    }

   

    //add new user
    addUser(data) {
        if(this.userName && this.emailAddress && this.phoneNumber){
            let obj = {
                userName : this.userName,
                password: "123456",
                email : this.emailAddress,
                phoneNumber : this.phoneNumber,
                roleId:this.utilService.getRole(),
                designationId:this.designation,
                divisionId:this.division,
                departmentId:this.department,
                reportingTo:this.reportingTo,
                isDefault:this.defaultSetting,
                }
            this.userService.addUser(obj).subscribe(result => {
                  this.closeAddForm();
                  this.alertService.success(this.labels.userAdded);
            });
        }
    }

    updateUser(data){
        //this.closeAddForm();
        this.alertService.success(this.labels.userUpdated);
    }
     
    

    //reset
    resetFields() {
        this.editEnable= false;
        this.userName = '';
        this.userId = '';
        this.department = '';
        this.designation = '';
        this.division = '';
        this.reportingTo = '';
        this.emailAddress = '';
        this.phoneNumber = '';
    }

   

    //delete user
    removeUser(data, i) {
        if (this.constant.userList.length) {
            let index = this.constant.userList.findIndex(x => x.employeeId === data.employeeId);
            this.constant.userList.splice(index, 1);
            this.message = (data.employeeName + this.labels.removeUser);
            this.alertService.success(this.message);
        }
    }

    //user update submit
    userUpdate(sortedList, data, index) {
        this.validationUpdate(sortedList, "submit");
        if (this.userId && this.userName && this.department && this.designation && this.emailAddress && !this.validEmail && this.phoneNumber && !this.validPhone && !this.validUserId) {
            let i = data.employeeId === '' ? ('0') : this.constant.userList.findIndex(x => x.employeeId === data.employeeId);
            this.constant.userList[i] = {
                "employeeId": this.userId,
                "employeeName": this.userName,
                "department": this.department,
                "designation": this.designation,
                "emailId": this.emailAddress,
                "DOB": this.constant.userList[i].DOB,
                "mobile": this.phoneNumber,
            };
            this.userIndex = '';
            this.resetFields();
            this.message = data.employeeId === '' ? (this.labels.userAdded) : (this.labels.userUpdated);
            this.constant.userList = _.orderBy(this.constant.userList, ['employeeId'], ['asc'])
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

    validationUpdate(list, type) {
        if (type === "email") {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
        }
        else if (type === "mobile") {
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) ? false : true;
        }
        else if (type === "userId") {
            let idCheck = list.find(x => x.employeeId === this.userId);
            let editIndexCheck = list.findIndex(x => x.employeeId === this.userId)
            this.validUserId = idCheck ? (this.userIndex === editIndexCheck ? false : true) : false;
        }
        else {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) ? false : true;
            let idCheck = list.find(x => x.employeeId === this.userId);
            let editIndexCheck = list.findIndex(x => x.employeeId === this.userId)
            this.validUserId = idCheck ? (this.userIndex === editIndexCheck ? false : true) : false;
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
            let phoneNumValid = phoneNum ? (phoneNum.length === 10 ? true : false) : false;
            return phoneNumValid
        }
    }

    messageClose() {
        this.message = '';
    }
    fileUpload(event) {
        let fileUploadValue = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            let finalData = XLSX.utils.sheet_to_json(worksheet, { raw: true })
            finalData && finalData.forEach(item => {
                this.constant.userList.push(item)
            })
        }
        fileReader.readAsArrayBuffer(fileUploadValue);
    }
}
