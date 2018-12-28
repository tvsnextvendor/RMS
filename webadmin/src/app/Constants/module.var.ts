import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModuleVar {
   
    active       = 'Active';
    title        = 'Modules';
    createModule = 'Create Module';
    activeStatus =  [];
    moduleList;
    url;
    moduleId;
    courseId;
    videoLink;
    selectedModule;
    selectedCourse;
    labels = {
        "moduleName" : "Module Name",
        "isRequire" : " is Required*",
        "course" : "Course",
        "coursesAdded" : "Courses Added",
        "addCourseTitle" : "Add New Course",
        "editCourseTitle" : "Edit Course",
        "courseName" : "Course Name",
        "videoName" : "Video Name",
        "description" : "Description",
        "upload" : "Upload",
        "next": "NEXT",
        "save" : "SAVE",
        "addNewCourse" : "ADD NEW COURSE",
        "videoAddedToast" : "Course videos added successfully",
        "videoUpdatedToast" : "Course videos updated successfully",
        "mandatoryFields" : "mandatory fields missing",
        "courseNameError" : "Course name is mandatory",
        "videoError" : "Minimum one video data required",
        "moduleCreateMsg" : "Module Created Successfully",
        "moduleUpdateMsg" : "Module Updated Successfully",
        "moduleCreateError" : "Unable to create module",
        "courseError":"Minimum one course is required*",
        "noData" : "No Courses Created Yet",
        "activeMsg"   : ' is Activated',
        "deactiveMsg" : ' is Deativated',
        "moduleNameValidation": "Module Name already taken",
        "addCourseSuccess" : "Course added successfully",
        "updateCourseSuccess" : "Course updated successfully",
        "removeVideoSuccess" : " removed from the video list"
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