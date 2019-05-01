import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CommonLabels{
        
    labels = {
        "createdBy"        : "Create By",
        "createdOn"        : "Created On",
        "lastModifiedOn"   : "Last Modified On",
        "noOfTrainingClass": "No. of Training Class",
        "noOfContentFiles" : "No. of Content Files",
        "noOfEmployee"     : "No. of Employees",
        "fileSize"         : "File Size",
        "file"             : "Files",       
        "count"            : "Count:",
        "edit"             : "Edit",
        "viewQuiz"         : "View Quiz",
        "video"            : "Video(s)",
        "document"         : "Document(s)",
        "filter"           : "Filter",                
        "deleteDoc"        : "Delete Document",
        "deleteDocConfirmation": "Are you sure you want to delete this document?",
        "upload"           : "Upload",
        "cancel"           : "Cancel",
        "cmsLibrary"       : "CMS Library",
        "course"           : "Course",
        "trainingClass"    : "Training Class",
        "videos"           : "Videos",
        "documents"        : "Documents",
        "notification"     : "Notification",
        "quiz"             : "Quiz",
        "recentlyDelete"   : "Recently Deleted",
        "duplicate"        : "Duplicate",        
        "saveAsNew"        : "Save As New Version",
        "desktop"          : "Desktop",
        "fileName"         : "File Name",
        "description"      : "Description",
        "isRequired"       : "is Required",
        "fileisRequired"   : "File is Required",         
        "type"             : "Type",
        "length"           : "Length",
        "noofEmp"          : "No.of Emp.",
        "permission"       : "Permission",
        "action"           : "Action",
        "select"           : "Select" ,
        "courseName"        : "Course Name",
        "videoTitle"        : "Video Title",       
        "uploadVideos"      :   "Upload Videos",
        "active"            :   "Active",
        "resort"            :   "Resort",
        "division"          :   "Division",
        "department"        :   "Department",
        "employees"         :   "All Employees",       
        "deleteVideo"       :   "Delete Video",
        "coursedeleteConfirmation": "This file will be deleted from all courses,Do you still want to  continue?", 
        "selectopt"         :   "--Select Training Class--",
        "selectcourse"      :   "--Select course--",
        // "video"           : "Video",
        "assignTo"          :   "Assign To",
        "questionType"      :   "Question Type",
        "question"          :   "Question",
        "options"           :   "Options",
        "answer"            :   "Answer",
        "true"              :   "True",
        "false"             :   "False",
        "weightage"         :   "Weightage",
        "totalNoOfQuestions":   "Total No of Question(s)",
        "deleteQuiz"        :   "Delete Quiz",
        "deleteConfirmation":   "Are you sure you want to delete this quiz question?",
        "a"                 :   "A",
        "b"                 :   "B",
        "c"                 :   "C",
        "d"                 :   "D",
        "selectptdivision"  :   "--Select Parent Division--",
        "selectptdpmt"      :   "--Select Parent Department --",
        "selectchildresort" :   "--Select Child Resort--",
        "selectchilddivi"   :   "--Select Child Division--",
        "selectchilddpmt"   :   "--Select Child Department --",
        "selectcreateuser"  :   "--Select Create user --"
        





        

              
    };

    btns = {
        "ok"                :   "Ok",
        "cancel"            :   "Cancel",
        "save"              :   "Save",
        "print"             :   "Print",
        "workinProgress"    :   "Work in Progress",
        "scheduleTraining"  :   "Schedule a Training",
        "createNotification":   "Create Notification",
        "createCourse"      :   "Create Course",
        "add"               :   "Add",
        "addNew"            :   "Add New",
        "assign"            :   "Assign",
        "yes"               :   "Yes",
        "no"                :   "No",
        "create"            :   "Create",
        "set"               :   "Set",
        "addvideocourse"    :   "Add Video to Course",
        "addQuiz"           :   "Add Quiz",
        "apply"             :   "Apply",
        "clearFilter"       :   "Clear Filter",
    };

    titles = {
        "cmsLibrary" : "CMS Library",        
    };

    imgs = {
        "profile" : "assets/images/Add_Profile_Picture.png",
        "close"   : "assets/images/close.png",
        "ok"      : "assets/images/Done.png",
        "cancel"  : "assets/images/cancel2.png"

    };

    mandatoryLabels ={
        "videoTitle"     : "Video Title is required",
        "courseName"     : "Course Name is required",
        "description"    : "Description is required",   
        "selectDept"     : "Department is required.",
        "selectResort"   : "Resort is required.",
        "selectEmp"      : "Employee is required.",
        "selectDivision" : "Division is required." ,
        "courseRequired" : "Course is required." ,
        "trainingClassrequired" : "Training Class is required.",
        "videoName"   : "Video name is required",
         "isRequired"  : "is required",
     };

     modaltitle ={
        "addnewtrainingschedule" : "Add New Training Schedule",
        "editVideo" : "Edit Video" 
     }

}