import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Injectable({ providedIn: 'root' })

export class CertificateVar {

    labels = {
        batch: 'Batch',
        course: 'Course',
        template: 'Template',
        tempName: 'Template Name',
        tempNameMandatory: 'Template Name is required.',
        uploadErrMsg: 'Template File is mandatory',
        fileUpload: 'Upload your HTML File',
        chooseFile: 'Choose File',
        badge: 'Badge',
        gold: 'Gold',
        silver: 'Silver',
        bronze: 'Bronze',
        diamond: 'Diamond'
    };

    btns = {
        upload: 'UPLOAD',
        save: 'SAVE',
        cancel: 'CANCEL',
        add: 'ADD'
    }

    title = 'Certificates';
    formTitle = 'Certificates Templates';
    modalHeader = 'Add Certificate Template';
    uploadSuccessMsg = 'Certificate Template uploaded successfully';
    uploadErrMsg = 'Template File is mandatory';
    assignSuccessMsg = 'Template Assigned Successfully';
    assignErrMsg = 'Invalid Batch Selection';
    badgeSuccessMsg = 'Badges Selected Successfully';
    badgepercentageError = 'Badge pass percentage already assigned';
    badgeRequiredMsg = 'Select All Badge Percentages';
    url;
    certificateList;
    courseList;
    badgePercentage;
    showUploadErrMsg = false;
    badgesRequired = false;
    tempName;
    fileToUpload: File = null;
    diamond = null;
    gold = null;
    silver = null;
    bronze = null;
    templateAssign: any[] = [{
        course: 1,
        template: 1
    }
    ]
    modalRef: BsModalRef;
    modalConfig = {
        backdrop: true,
        ignoreBackdropClick: true
    };

}