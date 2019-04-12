import { Injectable } from '@angular/core';

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
        "apply" : "Apply"

    }

}