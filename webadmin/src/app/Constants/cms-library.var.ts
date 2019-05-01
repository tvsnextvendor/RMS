import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Injectable({ providedIn: 'root' })
export class CmsLibraryVar {
        
    

    //  btns = {
    //     "ok":'Ok',
    //     "cancel":'Cancel',
    //     "save": "Save",
    //     "print": "Print",
    //     "workinProgress" : "Work in Progress",
    //     "scheduleTraining" : "Schedule a Training",
    //     "createNotification" : "Create Notification",
    //     "createCourse" : "Create Course"
    // }
    fileId;
    modalRef: BsModalRef;




}