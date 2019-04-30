import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

@Injectable({ providedIn: 'root' })
export class VideoVar {
    videoFormLabels = {
        courseName       : 'Course Name',
        videoTitle       : 'Video Title',
        videoDescription : 'Description',
        uploadVideos     : 'Upload Videos',
        active           : 'Active',
        resort           : 'Resort',
        division         : 'Division',
        department       : 'Department',
        employees        : 'All Employees',
        select           : 'Select',
        deleteVideo      : "Delete Video",
        deleteDocConfirmation: "This file will be deleted from all courses,Do you still want to  continue?",

    };
    btns = {
        addBtn : 'ADD NEW',
        add    : 'ADD',
        assign : 'ASSIGN',
        yes    : 'Yes',
        no     : 'No',
        create : 'Create',
        cancel : 'Cancel',
        set    : "Set",
        ok     : "Ok"
     };
     modalLabels ={
       title      : 'Add New Course Name',
       courseName : 'Course Name'
     };
     mandatoryLabels ={
        videoTitle  : 'Video Title is required',
        courseName  : 'Course Name is required',
        description : 'Description is required',   
        selectDept  : 'Department is required.',
        selectResort : 'Resort is required.',
        selectEmp    : 'Employee is required.',
        selectDivision: 'Division is required.'    
     };
    courses:any=[];
    moduleList:any=[];
    moduleType=null;
    modalRef: BsModalRef;
    modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true
    };
    resortList: IMultiSelectOption[];
    divisionList: IMultiSelectOption[];
    departmentList: IMultiSelectOption[];
    employeeList: IMultiSelectOption[];
    employeeId;
    resortId;
    fileId;
    divisionId;
    departmentId;
    empValidate = false;
    selectedEmp = [];
    selectedResort = null;
    selectedDivision = [];
    selectedDepartment = [];


    departmentSettings = {
        singleSelection: false,
        idField: 'departmentId',
        textField: 'departmentName',
        enableCheckAll: false,
        itemsShowLimit: 8,
        }
        resortSettings = {
        singleSelection: false,
        idField: 'resortId',
        textField: 'resortName',
        enableCheckAll: false,
        itemsShowLimit: 8,
        }
        empSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'userName',
        enableCheckAll: false,
        itemsShowLimit: 8,
        }
        divisionSettings = {
        singleSelection: false,
        idField: 'divisionId',
        textField: 'divisionName',
        enableCheckAll: false,
        itemsShowLimit: 8,
        }

}