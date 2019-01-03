import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Injectable({ providedIn: 'root' })

export class ForumVar{

    ForumFormLabels = {
        forumName        : 'Forum Name',
        empCount         : 'Employee Count',
        activeInActive   : 'Active/Inactive',
        action           : 'Action'
    };
    forumList: any =[];
    createForum = {
        editForum   : 'Edit Forum',
        createForum : 'Create Forum',
        forumName   : 'Forum Name',
        topics      : 'Topics',
        empName     : 'Department',
        admin       : 'Admin',
        selDept     : 'Select Department',
        selAdmin    : 'Select Admin',
        noData      : 'No data'
    };
    btns ={
        create : 'Create',
        cancel : 'Cancel',
        save   : 'Save'
    };
    mandatoryLabels ={
        forumName   :  'Forum Name is required',
        topic       :  'Topic is required',
        empName     :  'Department is required',    
        admin       :  'Admin is required'   
    };
    title = 'Forum';
    addSuccessMsg = 'Forum Added Successfully';
    updateSuccessMsg = ' is updated successfully';
    nameUniqueErr = 'Forum Name is already exist.'
    employeeItems;
    forumName;
    topics;
    autocompleteItemsAsEmpObjects;
    adminItems;
    adminList;
    url;
    forumNameList;
    uniqueValidate = false;
    editNameValidate = false;
    modalRef:BsModalRef;
    modalConfig = {
        backdrop: true,
        ignoreBackdropClick: true
      };
}