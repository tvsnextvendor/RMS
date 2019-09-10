import { Component, TemplateRef, OnInit, ViewChild, Input } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from "lodash";
import { TabsetComponent } from 'ngx-bootstrap';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { UserVar } from '../Constants/user.var';
import { BatchVar } from '../Constants/batch.var';
import { API_URL } from '../Constants/api_url';
import { API } from '../../app/Constants/api';
import { AlertService, PDFService, ExcelService, CommonService, BreadCrumbService,PermissionService } from '../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as XLSX from 'ts-xlsx';
import { UserService, ResortService, UtilService } from '../services';
import { RolepermissionComponent } from '../rolepermission/rolepermission.component'
import { CommonLabels } from '../Constants/common-labels.var'

@Component({
    selector: 'app-users',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild(RolepermissionComponent) roleComponent: RolepermissionComponent;
    userName;
    firstName;
    userId;
    userType;
    department = [];
    designation = [];
    division = [];
    reportingTo = "";
    emailAddress;
    phoneNumber;
    homeNumber;
    userIndex;
    pageLimitOptions = [];
    pageLimit;
    labels;
    message;
    accessTo = "web";
    editEnable = false;
    validPhone = false;
    validEmail = false;
    validHomeNo= false;
    validUserId = false;
    triggerNext = false;
    departmentArray = [];
    designationArray = [];
    divisionArray = [];
    designationData = [];
    fileUploadValue;
    userid;
    arrayBuffer: any;
    divisionDetails = [];
    divisionError;
    divisionValidationCheck = true;
    errorValidation = true;
    editDivisionValue;
    editDepartmentList = [];
    divisionId;
    errMsg;
    roles;
    roleDetails = [];
    roleId;
    editRoleValue;
    removeDepartmentIds = [];
    roleError;
    roleFormSubmitted = false;
    errorValidate;
    validationDivisionCheck = true;
    bulkUploadData;
    selectedDivisionId = [];
    selectedDepartmentId = [];
    selectedDesignationId = [];
    empId;
    editData;
    removedMappingId = [];
    enableRolePermission = false;
    duplicateError;
    editlabel;
    userIdData;
    designationArrays;
    API_ENDPOINT;
    csvDownload;
    xlsDownload;
    search;
    existingFile = [];
    fileExist = false;
    lastName;
    uploadPermission = true;
    userTab = true;
    viewUserRolePermission = false;
    userStatus = '';
    userPagesEnable = false;
    selectTab = 'user';
    activatedTab = 'user';
    resortId = null;
    bulkUploadWarn = false;
    fullAccess = 'full'
    approvalAccess = null;
    childResort = [];
    childResortFilterList = [];
    designationSettings = {
        singleSelection: false,
        idField: 'designationId',
        textField: 'designationName',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableCheckAll: true,
        itemsShowLimit: 8,
        allowSearchFilter : true,
        searchPlaceholderText : "Search",
        clearSearchFilter : true
    }


    constructor(private pdfService: PDFService, private excelService: ExcelService, private alertService: AlertService, private commonService: CommonService, private utilService: UtilService, private userService: UserService, private resortService: ResortService, private http: HttpService, private modalService: BsModalService, public constant: UserVar, private headerService: HeaderService, private toastr: ToastrService, private router: Router,private commonLabels: CommonLabels, public batchVar: BatchVar, private breadCrumbService: BreadCrumbService,public permissionService : PermissionService,
        private activatedRoute : ActivatedRoute) {
        this.constant.url = API_URL.URLS;
        this.API_ENDPOINT = API.API_ENDPOINT;
    }
    ngOnInit() {
        let roleId = this.utilService.getRole();
        let userData = this.utilService.getUserData();
        // this.csvDownload = this.API_ENDPOINT + '8103/downloads/rms-usertemplate.csv';
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        this.resortId = resortId;
        this.xlsDownload = this.API_ENDPOINT + '8101/user/createXLS';
        // this.xlsDownload = resortId  ? this.API_ENDPOINT + '8101/user/createExcelTemplate?resortId='+resortId : '';
        this.headerService.setTitle({ title: this.commonLabels.titles.userManagement, hidemodule: false });
        this.breadCrumbService.setTitle([]);
        this.pageLimitOptions = [5, 10, 25];
        this.pageLimit = [this.pageLimitOptions[1]];
        this.userList();
        this.getResortId();
        if(roleId == 4 && !this.permissionService.uploadPermissionCheck("User Management")){
            this.uploadPermission = false;
        }
        this.activatedRoute.params.subscribe((params) => {
            if(params && Object.keys(params).length){
                this.roleTabSelect(params.type)
                this.activatedTab = params.type;
            }
            else{
                this.breadCrumbService.setTitle([]);
                this.userPagesEnable = false;
                this.selectTab = 'user';
            }
        });
    }

    getResortId() {
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';

        //get Resort list
        this.resortService.getResortByParentId(resortId).subscribe((result) => {
            this.divisionArray = (result.data) ? result.data.divisions : [];

        });

        let query = "?parentId="+resortId;
        this.commonService.getAllResort(query).subscribe(result=>{
            if(result && result.isSuccess){
                this.childResortFilterList = result.data  && result.data.length ? result.data : [];
            }
        })
        this.getDivisionList(resortId);
    }

    permissionCheck(){
        return this.permissionService.editPermissionCheck("User Management")
    }

    getDivisionList(resortId) {
        this.commonService.getResortDivision(resortId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let data =  resp.data.length && resp.data[0].resortMapping ? resp.data[0].resortMapping : [];
                this.divisionDetails = data.map(item=>{
                    item.expand = true;
                    return item
                })
            }else {
                this.roleDetails = [];
            }
        })

        this.userService.getResortDesignation(resortId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                this.roleDetails = resp.data.rows.length ? resp.data.rows : [];
            } else {
                this.roleDetails = [];
            }
        })
        this.commonService.getDesignationList(resortId).subscribe((result) => {
            if (result && result.isSuccess) {
                this.designationArray = result.data && result.data.rows;
            } else {
                this.designationArray = [];
            }

            
        })
        // this.commonService.getCreatedByDetails().subscribe(result => {
        //     if (result && result.isSuccess) {
        //         this.designationArrays = result.data && result.data;
        //     } else {
        //         this.designationArrays = [];
        //     }

        let userData = this.utilService.getUserData();
        let roleId = this.utilService.getRole();
        const userId = userData.userId;
        let resort = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        let query = roleId != 4 ? "?createdBy="+userId : "?resortId="+resort; 
        this.userService.getUser(query).subscribe((resp) => {
                if (resp.isSuccess) {
                this.designationArrays = resp.data.rows.length ? resp.data.rows : [];
            } else {
                this.designationArrays = [];
            }
        });

            // console.log(this.designationArray);
        // });

        this.roles = [{
            designationName: ''
        }]
    }

    userList() {
        let userData = this.utilService.getUserData();
        let roleId = this.utilService.getRole();
        const userId = userData.userId;
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        let query = roleId != 4 ? "?createdBy="+userId : "?resortId="+resortId; 
        if(this.search){
            query = query+"&search="+this.search;
        }
        this.userService.getUser(query).subscribe((resp) => {
            if (resp.isSuccess) {
                this.constant.userList = resp.data.rows.length ? resp.data.rows : [];
            } else {
                this.constant.userList = [];
            }
        });
        let data = this.utilService.getUserData();
        if (data && data.UserRole && data.UserRole[0] && data.UserRole[0].roleId) {
            this.userType = data.UserRole[0].roleId;
        }
    }

    changedivision() {
        this.department = [];
        this.departmentArray = [];
        const obj = { 'divisionId': this.division };
        this.commonService.getDepartmentList(obj).subscribe((result) => {
            if (result.isSuccess) {
                this.departmentArray = result.data.rows;
            }
        })
    }

    //update user
    userEdit(data, index) {
        this.userid = data.UserRole[0].userId;
        this.editEnable = true;
        this.userIndex = index;
        this.firstName = data.firstName;
        this.lastName = data.lastName && data.lastName;
        this.userId = data.employeeId;
        this.division = data.ResortUserMappings.length ? this.getEditSelectedArray(data.ResortUserMappings, 'div') : [];
        this.division.length && this.onEmpSelect('', 'div');
        this.reportingTo = data.reportDetails ? data.reportDetails.userId : '';
        this.designation = data.ResortUserMappings.length ? this.getEditSelectedArray(data.ResortUserMappings, 'design') : [];
        this.emailAddress = data.email;
        this.phoneNumber = data.phoneNumber;
        this.empId = data.employeeNo;
        this.homeNumber = data.homeNumber;
        this.department = data.ResortUserMappings.length ? this.getEditSelectedArray(data.ResortUserMappings, 'dept') : [];
        this.accessTo = data.status;
        if(data.accessSet && data.accessSet == "FullAccess"){
            this.fullAccess = 'full';
            this.approvalAccess = null;
        }
        else{
            this.fullAccess = null;
            this.approvalAccess = 'approve';
        }
    }

    designationUpdate(data, designation) {
        if (data == "") {
            this.designationData = [];
        }
        this.designation = [];
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

    activeStatus(data) {
        let userId = data.UserRole[0].userId;
        let params = {
            active: !data.active
        }
        this.userService.activeUser(userId, params).subscribe(res => {
            if (res.isSuccess) {
                this.alertService.success(res.message);
                this.userList();
            }
        });
    }
    openAddUser(template: TemplateRef<any>, data, index) {
        this.divisionValidationCheck = true;
        this.errorValidation = true;
        this.errMsg = '';
        if (data) {
            this.editData = _.cloneDeep(data);
            this.userEdit(data, index);
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        } else {
            this.resetFields();
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
            this.getResortId();
        }

    }

    openAddRole(template: TemplateRef<any>, data, index) {
        if(data == 'bulk'){
            this.getResortDetails();
            this.resetBulkUploadData();
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }
        else{
            this.errorValidation = true;
            this.roleError = false;
            this.duplicateError = '';
            this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig);
        }
    }


    submitRole() {
        this.errorValidation = true;
        let checkData = [];
        let userData = this.utilService.getUserData();
        let resortId = userData && userData.ResortUserMappings && userData.ResortUserMappings[0].Resort.resortId;
        this.roleFormSubmitted = true;
        this.roleNameValidationCheck();
        if (this.roleId) {
            if (!this.roleError) {
                let params = {
                    designationName: this.editRoleValue
                }
                checkData.push(this.editRoleValue)
                let designCheck = { designationName: checkData }
                this.userService.checkDuplicate('role', designCheck).subscribe(resp => {
                    if (resp && resp.isSuccess) {
                        this.duplicateError = '';
                        this.userService.updateDesignation(this.roleId, params).subscribe(resp => {
                            if (resp && resp.isSuccess) {
                                this.getDivisionList(resortId);
                                this.constant.modalRef.hide();
                                this.resetFields();
                                this.roleError = false;
                                // this.roleComponent.getDropDownDetails('','');
                                this.alertService.success(this.commonLabels.msgs.designation)
                            }
                        }, err => {
                            this.errorValidation = false;
                            this.errorValidate = err.error.error;
                            this.alertService.error(err.error.error);
                        });
                    }
                    else {
                        this.duplicateError = resp.message;
                    }
                })
            }

        } else {
            let params = {
                resortId: resortId,
                designation: this.roles
            }
            if (!this.roleError) {
                checkData = this.roles.map(items => { return items.designationName });
                let designCheck = { designationName: checkData }
                this.userService.checkDuplicate('role', designCheck).subscribe(resp => {
                    if (resp && resp.isSuccess) {
                        this.duplicateError = '';
                        this.userService.addResortDesignation(params).subscribe(resp => {
                            if (resp && resp.isSuccess) {
                                this.getDivisionList(resortId);
                                this.constant.modalRef.hide();
                                this.resetFields();
                                // this.roleComponent.getDropDownDetails('','');
                                this.alertService.success(this.commonLabels.msgs.designationAdd)
                            }
                        }, err => {
                            this.errorValidation = false;
                            this.errorValidate = err.error.error;
                            this.alertService.error(err.error.error);
                        })
                    }
                    else {
                        this.duplicateError = resp.message;
                    }
                })

            }
        }
    }

    roleNameValidationCheck() {
        if (this.roleId) {
            this.roleError = this.editRoleValue ? false : true;
        }
        else {
            this.roles.forEach(item => {
                if (item.designationName === '') {
                    this.roleError = true;
                }
                else {
                    this.roleError = false;
                }
            })
        }
    }

    //delete user
    removeUser(template: TemplateRef<any>, data, i) {
        let modalConfig = {
            class: "modal-dialog-centered"

        }
        this.userid = data.UserRole[0].userId;
        this.constant.modalRef = this.modalService.show(template, modalConfig);
    }

    deleteuser() {
        this.userService.deleteUser(this.userid).subscribe((result) => {
            if (result.isSuccess) {
                this.constant.modalRef.hide();
                this.userList();
                this.alertService.success(result.message);
            }
        },err=>{
            this.constant.modalRef.hide();
            this.alertService.error(err.error.error);
        })
    }

    //add new user
    addUser(data) {
        this.errMsg = '';
        let resortId = this.utilService.getUserData() && this.utilService.getUserData().ResortUserMappings[0].Resort.resortId;
        let obj = {
            firstName: this.firstName,
            lastName : this.lastName,
            email: this.emailAddress,
            phoneNumber: this.phoneNumber,
            homeNumber: this.homeNumber,
            designationId: this.designation.length ? this.designation.map(item => { return item.designationId }) : [],
            divisionId: this.division.length ? this.division.map(item => { return item.divisionId }) : [],
            departmentId: this.department.length ? this.department.map(item => { return item.departmentId }) : [],
            reportingTo: this.reportingTo,
            accessTo: this.accessTo,
            resortId: resortId,
            employeeNo: this.empId,
            accessSet : this.fullAccess == 'full' ? 'FullAccess' : 'ApprovalAccess',
            resortUserMappingId: [],
            // childResortIds : []
        };
        // this.childResort.length ? obj.childResortIds = this.childResort.map(item=>{return item.resortId}) : delete obj.childResortIds;
        if (this.firstName && this.permissionService.nameValidationCheck(this.firstName) && this.lastName && this.permissionService.nameValidationCheck(this.lastName) &&  this.empId && this.emailAddress && this.phoneNumber && this.division.length && this.department.length && this.designation.length && !this.validEmail && !this.validPhone && !this.validHomeNo) {
            if (this.editEnable) {
                this.removedMappingId.length ? obj.resortUserMappingId = this.removedMappingId : delete obj.resortUserMappingId;
                this.userService.updateUser(this.userid, obj).subscribe((result) => {
                    if (result.isSuccess) {
                        this.closeAddForm();
                        this.userList();
                        this.alertService.success(this.commonLabels.labels.userUpdated);
                    }
                }, err => {
                    this.errMsg = err.error.error;
                    this.alertService.error(this.errMsg);
                })
            } else {
                obj['createdBy'] = this.utilService.getUserData().userId;
                obj['password'] = "12345678";
                delete obj.resortUserMappingId;
                this.userService.addUser(obj).subscribe(result => {
                    if (result.isSuccess) {
                        this.closeAddForm();
                        this.userList();
                        this.alertService.success(this.commonLabels.labels.userAdded);
                    }
                }, err => {
                    this.errMsg = err.error.error;
                    this.alertService.error(this.errMsg);
                });
            }
        }
    }


    //reset
    resetFields() {
        this.editEnable = false;
        this.accessTo = "web";
        this.duplicateError = '';
        this.roleFormSubmitted = false;
        this.firstName = '';
        this.lastName = '';
        this.userId = '';
        this.roleId = '';
        this.department = [];
        this.designation = [];
        this.division = [];
        this.reportingTo = '';
        this.emailAddress = '';
        this.phoneNumber = '';
        this.homeNumber = '';
        this.triggerNext = false;
        this.editRoleValue = '';
        this.empId = '';
        this.fullAccess = 'full';
        this.approvalAccess = null;
        this.roles = [{
            designationName: ''
        }]
        this.constant.divisionTemplate = [{
            divisionName: '',
            departments: [
                {
                    departmentName: ''
                }
            ]
        }];
    }

    validationUpdate(type) {
        if (type === "email") {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
        }
        else if (type === "mobile") {
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) === 'invalidMobile' ? true : false;
        }
        else if (type === "home") {
            this.validHomeNo = this.homeNumber && this.validationCheck("home", this.homeNumber) === 'invalidHomeNo' ? true : false;
        }
        else {
            this.validEmail = this.emailAddress && this.validationCheck("email", this.emailAddress) === 'invalidEmail' ? true : false;
            this.validPhone = this.phoneNumber && this.validationCheck("mobile", this.phoneNumber) === 'invalidMobile' ? true : false;
        }
    }

    // email and mobile number validation check
    validationCheck(type, value) {
        switch (type) {
            case 'email':
                var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(value)) {
                    return "invalidEmail"
                }
                break;
           case 'mobile':
               let data = value.toString();
               let phoneNum = data.replace("+", "");
               let mobileRegex = /^(\d{10}|\d{11}|\d{12})$/;
               if (!(value.match(mobileRegex))) {
                   return "invalidMobile"
               }
           case 'home':
               let homeNum = value.toString();
               let number = homeNum.replace("+", "");
               let homeRegex = /^(\d{10}|\d{11}|\d{12})$/;
               if (!(value.match(homeRegex))) {
                   return "invalidHomeNo"
               }
        }
    }

    messageClose() {
        this.message = '';
    }
    viewUserDetail(user, i) {
        this.staticTabs.tabs[3].active = true;
        this.enableRolePermission = true;
        this.viewUserRolePermission = true;
        this.userStatus = user.status;
        this.userIdData = user.userId;
    }

    submitDivision() {
        this.errorValidation = true;
        let userData = this.utilService.getUserData();
        let resortId = userData && userData.ResortUserMappings && userData.ResortUserMappings[0].Resort.resortId;
        this.divisionValidationCheck = true;
        let divName = this.constant.divisionTemplate.map(item => { return item.divisionName });
        let deptName = [];
        this.constant.divisionTemplate.forEach(item => {
            item.departments.forEach(value => {
                if (value.departmentName === '' || !this.permissionService.nameValidationCheck(value.departmentName)) {
                    this.divisionValidationCheck = false;
                }
                deptName.push(value.departmentName);
            })
        })
        if (this.divisionValidationCheck) {
            let params = { divisionName: divName };
            this.userService.checkDuplicate('division', params).subscribe(resp => {
                if (resp && resp.isSuccess) {
                    let value = { departmentName: deptName }
                    this.userService.checkDuplicate('dept', value).subscribe(response => {
                        if (response && response.isSuccess) {
                            this.duplicateError = '';
                            this.addDivision(resortId);
                        }
                        else {
                            this.duplicateError = response.message;
                        }
                    })
                }
                else {
                    this.duplicateError = resp.message;
                }
            });

        } else {
            this.divisionError = this.commonLabels.mandatoryLabels.deptName;
        }
    }

    addDivision(resortId) {
        let params = {
            "resortId": resortId,
            "division": this.constant.divisionTemplate
        }
        this.userService.addDivision(params).subscribe(resp => {
            if (resp && resp.isSuccess) {
                this.triggerNext = false;
                this.getDivisionList(resortId);
                this.closeAddForm();
                // this.roleComponent.getDropDownDetails('','');
            }
        }, err => {
            this.errorValidation = false;
            this.errorValidate = err.error.error;
            this.alertService.error(err.error.error);
        })
    }

    departmentEditCheck(value) {
        if (value !== '' && !this.validationDivisionCheck) {
            this.validationDivisionCheck = true;
        }
    }

    next() {
        this.divisionValidationCheck = true;
        this.constant.divisionTemplate.forEach(item => {
            if (item.divisionName === '' || !this.permissionService.nameValidationCheck(item.divisionName)) {
                this.divisionValidationCheck = false;
            }
        })
        this.divisionValidationCheck ? this.triggerNext = true : this.divisionError = this.commonLabels.mandatoryLabels.diviName;
    }

    tabchange(event) {
        if (event.target.name === "department") {
            this.next();
        }
        else {
            this.triggerNext = false;
        }
    }

    editDivisionData(data, template: TemplateRef<any>, form) {
        this.editlabel = (form === 'add') ? this.commonLabels.labels.addDepartment : this.commonLabels.labels.editDivision;
        this.editDepartmentList = [];
        this.validationDivisionCheck = true;
        this.errorValidation = true;
        this.editDivisionValue = _.cloneDeep(data);
        let dataValue = data && data.Departments;
        this.editDepartmentList = _.cloneDeep(dataValue);
        this.constant.modalRef = this.modalService.show(template, this.constant.modalConfig)
    }

    fileUpload(event) {
        this.fileExist = false;
        const userId = this.utilService.getUserData().userId;
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        let fileUploadValue = event.target.files[0];
        if(this.existingFile.length){
            this.existingFile.forEach(item=>{
              if(item == fileUploadValue.name){
                this.fileExist = true;
                this.fileUploadValue = '';
                fileUploadValue = '';
                this.alertService.warn(this.commonLabels.msgs.fileExist)
              }
            })
          }
        if(!this.fileExist){
            this.existingFile.push(fileUploadValue.name)
            let params = { 
                            'file': fileUploadValue ,
                            'divisionId' : this.selectedDivisionId.toString(),
                            'departmentId' : this.department.map(item => { return item.departmentId }).toString(),
                            'designationId'  : this.designation.map(item =>{return item.designationId}).toString()
                        }
            if (fileUploadValue && this.selectedDivisionId.length && this.department.length &&  this.designation.length) {
                this.bulkUploadWarn = false;
                this.userService.bulkUpload(params, userId, resortId).subscribe(resp => {
                    if (resp && resp.isSuccess) {
                        this.constant.modalRef.hide();
                        this.userList();
                        this.fileUploadValue = '';
                        this.alertService.success(resp.message);
                        
                    }
                }, err => {
                    console.log(err.error.error);
                    this.constant.modalRef.hide();
                    this.fileUploadValue = '';
                    this.resetBulkUploadData();
                    this.alertService.error(err.error.error);
                })
            }
            else{
                this.bulkUploadWarn = true;
            }
        }
    }

    addForm(type, i) {
        if (type === "division") {
            let obj = {
                divisionName: '',
                departments: [
                    {
                        departmentName: ''
                    }
                ]
            };
            this.constant.divisionTemplate.push(obj);
        }
        else if (type === "department") {
            let obj = {
                departmentName: ''
            };
            this.constant.divisionTemplate[i].departments.push(obj);
            this.editDepartmentList.push(obj);
        }
        else if (type === 'roles') {
            let obj = {
                designationName: ''
            };
            this.roles.push(obj);
            this.roleNameValidationCheck();
        }
    }

    removeForm(i, type, oi) {
        if (type === "division") {
            this.constant.divisionTemplate.splice(i, 1);
        }
        else if (type === 'department') {
            this.constant.divisionTemplate[i].departments.splice(oi, 1);
        }
        else if (type === 'roles') {
            this.roles.splice(oi, 1);
        }
    }

    editDivisionForm(type, i) {
        if (type === 'add') {
            let obj = {
                departmentName: ''
            };
            this.editDepartmentList.push(obj);
        }
        else if (type === 'edit') {
            this.removeDepartmentIds.push(this.editDepartmentList[i].departmentId);
            this.editDepartmentList.splice(i, 1);
            this.validationDivisionCheck = true;
        }
    }

    //delete division
    removeDivision(template: TemplateRef<any>, data, i) {
        let modalConfig = {
            class: "modal-dialog-centered"
        }
        this.divisionId = data.Division.divisionId;
        this.constant.modalRef = this.modalService.show(template, modalConfig);
    }

    deleteDivisionContent() {
        this.userService.deleteDivision(this.divisionId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let userData = this.utilService.getUserData();
                let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
                this.constant.modalRef.hide();
                this.getDivisionList(resortId);
                this.userList();
                this.alertService.success(this.commonLabels.msgs.diviDeleted);
            }
        },err=>{
            this.constant.modalRef.hide();
            this.alertService.error(err.error.error);
        })
    }

    //delete role
    removeRole(template: TemplateRef<any>, data, i) {
        let modalConfig = {
            class: "modal-dialog-centered"
        }
        this.roleId = data.designationId;
        this.constant.modalRef = this.modalService.show(template, modalConfig);
    }

    deleteRoleContent() {
        this.userService.deleteDesignation(this.roleId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let userData = this.utilService.getUserData();
                this.roleId = '';
                let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
                this.constant.modalRef.hide();
                this.getDivisionList(resortId);
                this.userList();
                this.alertService.success(this.commonLabels.msgs.designDelete);
            }
        })
    }

    editRoleData(data, template: TemplateRef<any>) {
        this.roleError = false;
        this.errorValidation = true;
        let modalConfig = {
            class: ""

        }
        this.roleId = data && data.designationId;
        this.editRoleValue = data && data.designationName;
        this.constant.modalRef = this.modalService.show(template, modalConfig)
    }

    updateDivision() {
        this.errorValidation = true;
        let divName = [];
        let deptName = [];
        if (Object.keys(this.editDivisionValue).length) {
            this.validationDivisionCheck = true;
            let params = this.editDepartmentList.map(item => {
                if (!item.departmentId) {
                    item.divisionId = this.editDivisionValue.divisionId
                }
                if (item.departmentName === '') {
                    this.validationDivisionCheck = false;
                }
                deptName.push(item.departmentName);
                return item;
            })
            divName.push(this.editDivisionValue.divisionName)
            if (this.validationDivisionCheck) {
                this.editDivisionValue.Departments = params;
                this.editDivisionValue.removeDepartmentIds = this.removeDepartmentIds;
                this.updateDivsionSubmit();
            }
            else {
                this.alertService.error(this.commonLabels.mandatoryLabels.deptName);
            }
        }
    }

    updateDivsionSubmit() {
        this.userService.divisionUpdate(this.editDivisionValue, this.editDivisionValue.divisionId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let userData = this.utilService.getUserData();
                let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
                this.constant.modalRef.hide();
                this.getDivisionList(resortId);
                // this.roleComponent.getDropDownDetails('','');
                this.alertService.success(this.commonLabels.msgs.diviUpdate);
            }
        }, err => {
            this.errorValidation = false;
            this.errorValidate = err.error.error;
            this.alertService.error(err.error.error);
        });
    }

    cancelUpdate() {
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings ? userData.ResortUserMappings[0].Resort.resortId : '';
        // this.constant.modalRef.hide();
        this.closeAddForm();
        // this.getDivisionList(resortId);
    }

    onEmpAllSelect(event, key) {
        if (key == 'div') {
            this.division = event;
            if (!event.length) {
                this.departmentArray = [];
                this.department = [];
            }
            else {
                this.onEmpSelect('', 'div');
            }
        }
    }

    onEmpSelect(event, key) {
        this.selectedDivisionId = this.division.length && this.division.map(item => { return item.divisionId });
        this.selectedDepartmentId = this.department.length && this.department.map(item => { return item.departmentId });
        this.selectedDesignationId = this.designation.length && this.designation.map(item => { return item.designationId });
        if (key == 'div') {         
            if(this.selectedDivisionId.length){
                const obj = { 'divisionId': this.selectedDivisionId };
                this.commonService.getDepartmentList(obj).subscribe((result) => {
                    if (result.isSuccess) {
                        this.departmentArray = result.data.rows;
                        this.department = this.department.filter(o => this.departmentArray.find(x => x.departmentId === o.departmentId));
                    }
                })
            }
            else{
                this.departmentArray = [];
                this.department = [];
            }
        }
        // else if(key == 'dept'){

        // }
        // else {
        //     this.departmentArray = [];
        // }
    }

    onDeselect(event, key) {
        if (key == 'div') {
            let id = event.divisionId;
            this.editData ? this.editData.ResortUserMappings.forEach(item => {
                if (item.Division && item.Division.divisionId == id) {
                    let arr = [];
                    arr.push(item.resortUserMappingId);
                    this.removedMappingId = _.sortedUniq(arr);
                    this.department = this.department.filter(x => x.departmentId != item.departmentId);
                    this.onEmpSelect('', 'div');
                }
            }):this.onEmpSelect('', 'div');;
        }
        if (key == 'dept') {
            let id = event.departmentId;
            let obj = this.editData.ResortUserMappings.length && this.editData.ResortUserMappings.forEach(item => {
                if (item.Department && item.Department.departmentId == id) {
                    let arr = [];
                    arr.push(item.resortUserMappingId);
                    this.removedMappingId = _.sortedUniq(arr);
                }
            })
        }
        if (key == 'design') {
            let id = event.designationId;
            let obj = this.editData.ResortUserMappings.forEach(item => {
                if (item.Designation && item.Designation.designationId == id) {
                    this.removedMappingId.push(item.resortUserMappingId);
                }
            })
        }
    }

    getDivisionArray(data, type) {
        let arr = [];
        if (type == 'div') {
            let details = [];
            data.forEach(item => {
                if (item.Division) {
                    details.push(item.Division.divisionName)
                }
            });
            arr = Array.from(details.reduce((m, t) => m.set(t, t), new Map()).values());
        }
        if (type == 'dept') {
            data.forEach(item => { item.Department ? arr.push(item.Department.departmentName) : '' });
        }
        if (type == 'design') {
            data.forEach(item => { item.Designation ? arr.push(item.Designation.designationName) : '' });
        }
        return arr;
    }

    getEditSelectedArray(data, type) {
        let arr = [];
        if (type == 'div') {
            let details = []
            data.forEach(item => {
                if (item.Division) {
                    let obj = {
                        divisionId: item.Division.divisionId,
                        divisionName: item.Division.divisionName
                    }
                    details.push(obj);

                }
            });
            // arr = Array.from(details.reduce((m, t) => m.set(t, t.divisionId,t.divisionName), new Map()).values());
            arr = _.uniqBy(details,'divisionId')
            // console.log(arr,'arr')
        }
        if (type == 'dept') {
            data.forEach(item => {
                if (item.Department) {
                    let obj = {
                        departmentId: item.Department.departmentId,
                        departmentName: item.Department.departmentName
                    }
                    arr.push(obj)
                }
            });
        }
        if (type == 'design') {
            data.forEach(item => {
                if (item.Designation) {
                    let obj = {
                        designationId: item.Designation.designationId,
                        designationName: item.Designation.designationName
                    }
                    arr.push(obj)
                }
            });
        }
        return arr;
    }

    // Create PDF
    exportAsPDF() {
        // this.labels.btns.select =  this.labels.btns.pdf;
        var data = document.getElementById('userForm');
        this.pdfService.htmlPDFFormat(data, this.commonLabels.titles.userManagement);
    }
    // Create Excel sheet
    exportAsXLSX(): void {
        // this.labels.btns.select =  this.labels.btns.excel;
        let arr = this.constant.userList.map(item =>
            _.pick(item, ['firstName','lastName', 'email', 'phoneNumber', 'active'])
        )
        this.constant.userList.forEach((item, i) => {
            arr[i].empId = item.employeeNo;
            arr[i].role = String(this.getDivisionArray(item.ResortUserMappings, 'design'));
            arr[i].division = String(this.getDivisionArray(item.ResortUserMappings, 'div'));
            arr[i].department = String(this.getDivisionArray(item.ResortUserMappings, 'dept'));
            arr[i].reportingTo = item.reportDetails ? item.reportDetails.userName : '';
            arr[i].accessTo = item.status ? item.status : '';
            
        })
        // console.log(arr)
        this.excelService.exportAsExcelFile(arr, this.commonLabels.titles.userManagement);
    }

    roleTabSelect(type) {
        this.userPagesEnable = true;
        this.selectTab = type;
        this.userTab = false;
        // this.viewUserRolePermission = false;
        this.router.navigate(['/users/'+type]);
        if (type === 'rolesPermission') {
            this.enableRolePermission = true;
            if(!this.viewUserRolePermission){
                this.userIdData = '';
                this.userStatus = '';
            }
        }
        else if(type == 'user'){
            this.userTab = true;
            this.enableRolePermission = false;
            this.viewUserRolePermission = false;
        }
        else {
            this.enableRolePermission = false;
        }
        if(type != 'rolesPermission'){
            this.viewUserRolePermission = false;
        }
        switch(type){
            case 'user':
                let data1 = [{ title: this.commonLabels.labels.userManagement, url: '/users' }, { title: this.commonLabels.labels.selectUsers, url: '' }];
                this.breadCrumbService.setTitle(data1);
                break;
            case 'div':
                let data2 = [{ title: this.commonLabels.labels.userManagement, url: '/users' }, { title: this.commonLabels.labels.hierarchy, url: '' }];
                this.breadCrumbService.setTitle(data2);
                break;
            case 'roles':
                let data3 = [{ title: this.commonLabels.labels.userManagement, url: '/users' }, { title: this.commonLabels.labels.listofRole, url: '' }];
                this.breadCrumbService.setTitle(data3);
                break;
            case 'rolesPermission':
                let data4 = [{ title: this.commonLabels.labels.userManagement, url: '/users' }, { title: this.commonLabels.labels.rolesPermission, url: '' }];
                this.breadCrumbService.setTitle(data4);
                break;    
        }
    }

    back(type){
        if(type == 'roles'){
            this.viewUserRolePermission = false;
            this.roleTabSelect('user');
        }
        else{
            this.userPagesEnable = false;
            this.breadCrumbService.setTitle([]);  
        }
    }

    resetSearch(){
        this.search = '';
        this.userList();
    }
    cancelBulkUpload(){
        this.resetBulkUploadData();
        this.constant.modalRef.hide();
    }

    resetBulkUploadData(){
        this.fileExist = false;
        this.designation = [];
        this.division = [];
        this.department = [];
        this.departmentArray = [];
        this.batchVar.divisionList = [];
        this.batchVar.selectedResort = null;
        this.bulkUploadWarn = false;
        let userData = this.utilService.getUserData();
        this.resortId =  userData.ResortUserMappings && userData.ResortUserMappings.length ? userData.ResortUserMappings[0].Resort.resortId : '';
    }

    ngOnDestroy(){
        this.search = '';
        this.existingFile = [];
        this.fileExist = false;
        this.userPagesEnable = false;
        this.selectTab = 'user';
    }
    getResortDetails() {
        let userData = this.utilService.getUserData();
        let resortId = userData.ResortUserMappings && userData.ResortUserMappings.length ? userData.ResortUserMappings[0].Resort.resortId : '';
        this.commonService.getParentChildResorts(resortId).subscribe((result) => {
          if (result && result.isSuccess) {
              this.batchVar.resortList = result.data && result.data.rows.length ? result.data.rows : [];
          }
        });
    }
    getResortData(resortId) {
        this.batchVar.departmentList = [];
        this.batchVar.divisionList = [];
        this.batchVar.employeeList = [];
        this.batchVar.selectedDivision = [];
        this.batchVar.selectedDepartment = [];
        this.batchVar.selectedEmp = []; 
        this.resortService.getResortByParentId(resortId).subscribe((result) => {
            (this.resortId == parseInt(resortId)) ? this.batchVar.resortList = result.data.Resort : '';
            this.batchVar.divisionList = result.data.divisions;
            this.batchVar.selectedResort = resortId;
        })
    }

    accessSelect(type){
        if(type == "full"){
            this.fullAccess = 'full'
            this.approvalAccess = null;
        }
        else{
            this.fullAccess = null
            this.approvalAccess = "approve";
        }
        
    }
    hideDepartment(i){
        this.divisionDetails[i].expand = !this.divisionDetails[i].expand;
    }

    getLengthofUser(data){
        let value  = _.uniqBy(data,'userId')
        return value.length
    }
}
