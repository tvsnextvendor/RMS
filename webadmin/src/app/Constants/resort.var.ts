import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Injectable({ providedIn: 'root' })
export class ResortVar {
    url;
    title = "Add New Resort";
    resortList;
    resortName;
    location;
    email;
    phoneNumber;
    utilizedSpace;
    numberOfUser;
    status;
    storageSpace;
    allocatedSpace;
    statusList = [{id:1,name:"Active"},{id:2,name:"InActive"},{id:3,name:"Expired"}];
    labels ={
        "resortName" : "Resort Name",
        "location" : "Location",
        "email" : "Email",
        "mobile" : "Mobile",
        "utilizedSpace" : "Utilized Space",
        "numberOfUser" : "No. of Users",
        "status" : "Status",
        "createResort" : "Add New",
        "division" : "Division",
        "department" : "Department",
        "isRequired" : " is Required",
        "deleteResort":"Delete Resort",
        "deleteResortConfirmation":"Are you sure you want to delete this resort?",
    };
    btns = {
       
        "save" : 'SAVE',
        "cancel" : 'CANCEL',
        "ok":'Ok',
        "Cancel":'Cancel',
    }

    divisionTemplate: any[] = [{
        division: 1,
        divisionName : 'Division1'
    }];
    departmentTemplate: any[] = [{
        department: 1,
        departmentName : ''
    }];
    modalRef: BsModalRef;
    modalConfig = {
            backdrop: true,
            ignoreBackdropClick: true
        };
}