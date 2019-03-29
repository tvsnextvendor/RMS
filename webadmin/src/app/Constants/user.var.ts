import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class UserVar {

    labels = {
        "userName": "User Name",
        "designation": "Designation",
        "department": "Department",
        "mobile": "Mobile",
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
        "uploadEmp": 'upload employee',
        "addUser": 'Add User'
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

    }

    title = 'Users';
    url;
    userList;

}