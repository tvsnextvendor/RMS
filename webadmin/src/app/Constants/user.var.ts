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
        "select": 'Select',
        "noData": 'No data'
    }

    btns = {
        "uploadEmp": 'Bulk Upload',
        "addUser": 'Add User',
        "save" : 'SAVE',
        "cancel" : 'CANCEL'
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
        "division": 'Division is required'
    }

    title = 'User Management';
    url;
    userList;
    modalRef: BsModalRef;
    modalConfig = {
            backdrop: true,
            ignoreBackdropClick: true
        };

}