import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Injectable({ providedIn: 'root' })

export class ForumVar {

    ForumFormLabels = {
        forumName        : 'Forum Name',
        empCount         : 'Employee count',
        activeInActive   : 'Active / Inactive',
        lastactivedate   : 'Last Active Date',
        action           : 'Action'
    };
    forumList: any = [];
    createForum = {
        editForum   : 'Edit Forum',
        createForum : 'Create Forum',
        forumName   : 'Forum',
        topics      : 'Topics',
        empName     : 'Department',
        admin       : 'Admin',
        selDept     : 'Select Department',
        selAdmin    : 'Select Admin',
        noData      : 'No data'
    };
    btns = {
        create : 'Create',
        cancel : 'Cancel',
        save   : 'Save'
    };
    mandatoryLabels = {
        forumName   :  'Forum Name is required',
        topic       :  'Topic is required',
        empName     :  'Department is required',
        admin       :  'Admin is required',
        division    :  'Division is required'
    };
    title = 'Forum';
    addSuccessMsg = 'Forum created Successfully';
    updateSuccessMsg = 'Forum updated Successfully';
    deleteSuccessMsg = 'Forum deleted Successfully';
    nameUniqueErr = 'Forum Name is already exist.';
    employeeItems;
    forumName;
    forumAdmin;
    forumId;
    topics;
    autocompleteItemsAsEmpObjects;
    adminItems;
    adminList;
    url;
    forumNameList;
    startDate;
    endDate;
    isPinned = false;
    isActive = false;
    uniqueValidate = false;
    editNameValidate = false;
    modalRef:BsModalRef;
    modalConfig = {
        backdrop: true,
        ignoreBackdropClick: true
      };
}