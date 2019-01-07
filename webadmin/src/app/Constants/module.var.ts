import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModuleVar {
   
    active       = 'Active';
    title        = 'Programs';
    createModule = 'Create Program';
    activeStatus =  [];
    moduleList=[];
    hideAllVideos;
    hideCourseVideos;
    url;
    moduleId;
    courseId;
    videoLink;
    selectedModule;
    selectedCourse;
    courseVideos=[];
    labels = {
        "addModule" : "Add program",
        "editModule" : "Edit Program",
        "moduleName" : "Program Name",
        "isRequire" : " is Required*",
        "course" : "Course",
        "coursesAdded" : "Courses Added",
        "addCourseTitle" : "Add New Course",
        "editCourseTitle" : "Edit Course",
        "courseName" : "Course Name",
        "videoName" : "File Name",
        "description" : "Description",
        "upload" : "Upload",
        "next": "NEXT",
        "save" : "SAVE",
        "addNewCourse" : "ADD NEW COURSE",
        "showAll" : 'Show All',
        "videoAddedToast" : "Course files added successfully",
        "videoUpdatedToast" : "Course files updated successfully",
        "mandatoryFields" : "mandatory fields missing",
        "courseNameError" : "Course name is mandatory",
        "videoError" : "Minimum one file data required",
        "moduleCreateMsg" : "Program Created Successfully",
        "moduleUpdateMsg" : "Program Updated Successfully",
        "moduleCreateError" : "Unable to create program",
        "courseError":"Minimum one course is required*",
        "noData" : "No Courses Created Yet",
        "activeMsg"   : ' is Activated',
        "deactiveMsg" : ' is Deativated',
        "moduleNameValidation": "Program Name already taken",
        "addCourseSuccess" : "Course added successfully",
        "updateCourseSuccess" : "Course updated successfully",
        "removeVideoSuccess" : " removed from the file list"
    };
    courseList = [];
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
    description;
    courseIndex;
    tabKey;
    hidemodule;
    api_url;
    uploadFile ;
    videoIndex = 0;
    fileUrl;
    moduleNameCheck = false;
}