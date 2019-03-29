import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { EmailVar } from '../Constants/email.var';
import { API_URL } from '../Constants/api_url';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.css'],
})

export class EmailComponent implements OnInit {
    email: any = {};
    emailForm: any = { 'to': '', 'cc': '', 'subject': '' };
    departments: any = [];
    sendClicked = false;
    validEmail = false;
    selectedDepartment;
    userList = [];
    userDetails;
    dataModel;
    editorConfig ={};
    setSignatureStatus: boolean = true;
    constructor(private toastr: ToastrService, private headerService: HeaderService, private elementRef: ElementRef, private emailVar: EmailVar, private http: HttpService, private alertService: AlertService) {
        this.email.url = API_URL.URLS;
    }

    ngOnInit() {
        this.headerService.setTitle({ title: this.emailVar.title, hidemodule: false });
        this.departmentList();

       this.editorConfig= {
            "editable": true,
            "spellcheck": true,
            "height": "100px",
            "minHeight": "50px",
            "width": "auto",
            "minWidth": "0",
            "translate": "yes",
            "enableToolbar": true,
            "showToolbar": true,
            "placeholder": "Write Something...",
            "imageEndPoint": "",
            "toolbar": [
                ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
                ["fontName", "fontSize", "color"],
                ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
                ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
                ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"],
                // ["link", "unlink", "image", "video"]
            ]
        }

    }
    departmentList() {
        this.http.get(this.email.url.getDepartments).subscribe((resp) => {
            this.departments = resp['DepartmentList'];
        });
        this.http.get(this.email.url.getUsers).subscribe((resp) => {
            this.userList = resp['UserList'];
        });
    }

    sendMail() {
        // console.log(this.dataModel)
        this.sendClicked = true;
        if (this.emailForm.to && this.emailForm.subject) {
            let toAddress = this.selectedDepartment ? this.selectedDepartment + " Department" : this.emailForm.to;
            this.alertService.success("Mail sent successfully to " + toAddress);
            this.sendClicked = false;
            this.resetFields();
        }
        else if (!this.emailForm.to) {
            this.alertService.error("To address is mandatory");
        }
        else if (!this.emailForm.subject) {
            this.alertService.error("Subject data is mandatory");
        }
    }

    emailValidation() {
        if (this.emailForm.to === '') {
            this.selectedDepartment = '';
        }
        this.validEmail = this.emailForm.to && this.validationCheck("email", this.emailForm.to) === 'invalidEmail' ? true : false;
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
            let phoneNumValid = phoneNum ? (phoneNum.length === 10 ? true : false) : false;
            return phoneNumValid
        }
    }

    resetFields() {
        this.emailForm = { 'to': '', 'cc': '', 'subject': '' };
        this.selectedDepartment = '';
    }


    addSign() {
        this.userDetails = JSON.parse(localStorage.getItem('userData'));
        let content = this.dataModel;
        const signature = "<br><b>Thanks,</b><br>" + this.userDetails.username;
        if(this.setSignatureStatus){
            this.dataModel = (content) ? content + signature : signature;
            this.setSignatureStatus = false;
        }
    }

    groupMail(group) {
        console.log(group)
        let data = [];
        this.selectedDepartment = group.department;
        this.userList.forEach(items => {
            if (items.department === group.department) {
                data.push(items.emailAddress);
            }
        })
        console.log(data)
        if (data.length) {
            this.emailForm.to = data;
        }
        else {
            this.emailForm.to = '';
            this.alertService.warn("No members available in selected department");
        }
    }
}