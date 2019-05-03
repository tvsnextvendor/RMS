import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Injectable({ providedIn: 'root' })

export class UserVar {

    labels = {
        "userName": "User Name",
        "role": "Role",
        "division": "Division",
        "department": "Department",
        "mobile": "Mobile",
        "reportingTo": "Reporting to",
        "defaultSetting": "Default Setting",
        "accessTo":"Access To",
        "email": "Email",
        "employeeId": "Emp ID",
        "updateRestrictMsg": "Unable to perform update user",
        "addRestrictMsg": "Unable to perform add user",
        "mandatoryFields": "Fill all user data fields",
        "emailError": "Please enter valid mail id",
        "mobileError": "Please enter valid mobile number",
        "userUpdated": "User updated successfully",
        "userAdded": "User added successfully",
        "removeUser": " removed from the list",
        "deleteUser": "Delete User",
        "deleteDivision": "Delete Division",
        "deleteConfirmation": "Are you sure you want to delete this user?",
        "deleteRole": "Delete Role",
        "deleteRoleConfirmation": "Are you sure you want to delete this role?",
        "deleteDivisionConfirmation": "Are you sure you want to delete this division?",
        "select": 'Select',
        "noData": 'No data',
        "addDivision": " Add Division",
        "editDivision": " Edit Division",
        "addRole" : "Add Role",
        "editRole" : "Edit Role",
        "userManagement" : "User Management",
        "hierarchy" : "Hierarchy",
        "listofRole" : "List Of Role",
        "rolesPermission" : "Roles & Permission",
        "divisionName" : "Division Name",
        "entertheDepartment" : "Enter the Department",
        "web": "Web",
    }

    btns = {
        "uploadEmp": 'Bulk Upload',
        "addUser": 'Add User',
        "editUser": 'Edit User',
        "save" : 'SAVE',
        "cancel" : 'CANCEL',
        "ok":'Ok',
        "Cancel":'Cancel',
        "update": 'Update',
        "next" : "Next",
        "addnew" : "Add New"
    }

    mandatoryText = {
        "empId": 'Employee Id is required',
        "empIdExist": 'User ID already exist',
        "empName": 'Employee name is required',
        "dept": 'Department is required',
        "designation": 'Designation is required',
        "emailId": 'Email Id is required',
        "emailInvalid": 'Invalid Email',
        "mobNo": 'Mobile number is required',
        "invalidMobNo": 'Invalid Mobile Number',
        "reportingTo": 'Reporting is required',
        "division": 'Division is required',
        "divisionName" : "Division",
        "department" : "Department",
        "isRequired" : " is Required",
        "accessTo" : "Access To is Required"
    }

    title = 'User Management';
    url;
    userList;
    modalRef: BsModalRef;
    modalConfig = {
            backdrop: true,
            ignoreBackdropClick: true
        };

    divisionTemplate: any[] = [{
        divisionName : '',
        departments : [
            {
               departmentName : ''
            }
        ]
    }];
    departmentTemplate: any[] = [
        {
            departmentName : ''
        }
    ];

}