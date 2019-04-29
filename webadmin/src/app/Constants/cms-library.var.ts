import { Injectable } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


@Injectable({ providedIn: 'root' })
export class CmsLibraryVar {
        
    labels = {
        "createdBy" : "Create By",
        "createdOn"  : "Created On",
        "lastModifiedOn" : "Last Modified On",
        "noOfTrainingClass" : "No. of Training Class",
        "noOfContentFiles" : "No. of Content Files",
        "noOfEmployee" : "No. of Employees",
        "fileSize" : "File Size",
        "count" : "Count",
        "edit" : "Edit",
        "viewQuiz" : "View Quiz",
        "video" : "Video(s)",
        "document" : "Document(s)",
        "filter" : "Filter",
        "clearFilter" : "Clear Filter",
        "apply" : "Apply",
        "deleteDoc" : "Delete Document",
        "deleteDocConfirmation": "Are you sure you want to delete this document?",
        "upload" : "Upload",
        "cancel" : "Cancel",
        "cmsLibrary" : "CMS Library",
        "course" : "Course",
        "trainingClass" : "Training Class",
        "videos" : "Videos",
        "documents": "Documents",
        "notification" : "Notification",
        "quiz" : "Quiz",
        "recentlyDelete" : "Recently Deleted",
    }
       

     btns = {
        "ok":'Ok',
        "cancel":'Cancel',
        "save": "Save",
        "print": "Print",
        "workinProgress" : "Work in Progress",
        "scheduleTraining" : "Schedule a Training",
        "createNotification" : "Create Notification",
        "createCourse" : "Create Course"
    }
    fileId;
    modalRef: BsModalRef;




}