import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModuleVar {
   
    active       = 'Active';
    title        = '';
    divisionName   = 'Mt.Operation';
    createModule = 'Create Program';
    activeStatus =  [];
    moduleList=[];
    fileId;
    hideAllVideos;
    hideCourseVideos;
    url;
    moduleId;
    courseId;
    videoLink;
    selectedModule;
    selectedVideo=[];
    selectedCourse;
    courseVideos=[];
    labels = {
        // "addModule" : "Add Program",
        // "editModule" : "Edit Program",
        // "editCourse" : "Edit Course",
        // "courseName" : "Course Name",
        // "isRequire" : " is Required*",
        // "course" : "Training Class",
        // "topics" : "Topic",
        // "coursesAdded" : "Training Class Added",
        // "addCourseTitle" : "Add New Training Class",
        // "editCourseTitle" : "Edit Training Class",
        // "trainingClassName" : "Training Class Name",
        // "videoName" : "File Name",
        // "description" : "Description",
        // "upload" : "Upload",
        // "next": "NEXT",
        // "save" : "SAVE",
        // "addNewCourse" : "ADD NEW TRAINING CLASS",
        // "showAll" : 'Show All',
        // "videoAddedToast" : "Course files added successfully",
        // "videoUpdatedToast" : "Course files updated successfully",
        // "mandatoryFields" : "mandatory fields missing",
        // "courseNameError" : "Training Class name is mandatory",
        // "videoError" : "Minimum one file data required",
        // "moduleCreateMsg" : "Course Created Successfully",
        // "moduleUpdateMsg" : "Course Updated Successfully",
        // "moduleCreateError" : "Unable to create course",
        // "courseError":"Minimum one training class is required*",
        // "noData" : "No Training Classes Created Yet",
        // "activeMsg"   : ' is Activated',
        // "deactiveMsg" : ' is Deativated',
        // "moduleNameValidation": "Program Name already taken",
        // "addCourseSuccess" : "Training Class added successfully",
        // "updateCourseSuccess" : "Training Class updated successfully",
        // "removeVideoSuccess" : " removed from the file list",
        // "topicName" : "Topic Name",
        // "trainingClass" : "Training Class",
        // "contentFiles" : "Content Files",
        // "createNotification" : "Create Notification",
        // "scheduleTraining" : "Schedule A Training",
        // "createCourse" : "Create Course",
        // "cmsLibrary" : "CMS Library", 
        // "desktop": "Desktop",
        // "file":"File",
        // "publish" : "Publish",
        // "acceptedFileTypes": "Accepted file types: PPT, TXT, MP4, JPG, DOC, MPEG, AVI"

    };
    courseList = [];
    courseListPage = [];
    courseItems = [];
    dropdownSettings;
    quizDetails = [];
    selectedCourseIds = [];
    // courseId;
    videoId;
    videoFile;
    moduleObj;
    selectedCourses = [];
    moduleName;
    sortableList;
    videoList = [];
    tabEnable = false;
    selectCourseName;
    selectVideoName;
    programName;
    description;
    courseIndex;
    tabKey;
    hidemodule;
    api_url;
    uploadFile ;
    videoIndex = 0;
    fileUrl;
    moduleNameCheck = false;
    modalRef;
    modalConfig;
    fileExtension;
}