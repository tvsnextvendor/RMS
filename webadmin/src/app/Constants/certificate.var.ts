import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CertificateVar{

   labels = {
        batch             : 'Batch',
        program           : 'Program',
        template          : 'Template',
        tempName          : 'Template Name',
        tempNameMandatory : 'Template Name is required.',
        fileUpload        : 'Upload your HTML File'        
    };
     
    btns = {
        upload  :  'UPLOAD',
        save    :  'SAVE',
        cancel  :  'CANCEL',
        add     :  'ADD'
    }

    title            = 'Certificates';
    formTitle        = 'Certificates Templates';
    modalHeader      = 'Add Certificate Template';
    uploadSuccessMsg = 'Certificate Template uploaded successfully';
    uploadErrMsg     = 'Template File is mandatory';
    assignSuccessMsg = 'Template Assigned Successfully';
    assignErrMsg     = 'Invalid Batch Selection';
    url;
    certificateList;
    programList;
    fileToUpload: File = null;
    templateAssign : any[]=[{
        program: 1,
        template: 2
      }
     ]
  
}