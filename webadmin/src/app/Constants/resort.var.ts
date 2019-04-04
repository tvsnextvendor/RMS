import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResortVar {
    url;
    title = "Add New Resort";
    resortList;
    resortName;
    location;
    email;
    mobile;
    utilizedSpace;
    numberOfUser;
    status;
    storageSpace;
    allocatedSpace;
    labels ={
        resortName : "Resort Name",
        location : "Location",
        email : "Email",
        mobile : "Mobile",
        utilizedSpace : "Utilized Space",
        numberOfUser : "No. of Users",
        status : "Status",
        createResort : "Add New",
        division : "Division",
        department : "Department",
        isRequired : " is Required"
    };
    divisionTemplate: any[] = [{
        division: 1,
        divisionName : 'Division1'
    }];
    departmentTemplate: any[] = [{
        department: 1,
        departmentName : ''
    }];
}