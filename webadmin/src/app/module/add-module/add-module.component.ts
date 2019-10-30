import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { HttpService, HeaderService, UtilService, AlertService, CommonService, CourseService, BreadCrumbService, FileService, PermissionService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddQuizComponent } from '../add-quiz/add-quiz.component';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { API } from '../../Constants/api';
import { CommonLabels } from '../../Constants/common-labels.var'
// import { filter } from 'rxjs/operators';
declare var require: any
var FileUploadThumbnail = require('file-upload-thumbnail');

@Component({
    selector: 'app-add-module',
    templateUrl: './add-module.component.html',
    styleUrls: ['./add-module.component.css'],
})

export class AddModuleComponent implements OnInit {

    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild(AddQuizComponent)
    private quiz: AddQuizComponent;
    moduleId;
    moduleCourseId;
    selectedCourses = [];
    selectedQuiz = null;
    courseDetailsList = [];
    moduleName;
    topics;
    showImage = false;
    videoSubmitted = false;
    courseSubmitted = false;
    moduleSubmitted = false;
    uploadFile;
    fileId;
    fileUrl;
    fileName;
    labels;
    tabEnable = false;
    message;
    videoMessage;
    previewImage;
    quizCheck = false;
    filePath = '';
    fileExtensionType;
    fileImageDataPreview;
    fileDuration;
    removedFileIds = [];
    modalRef;
    addButton;
    quizList = [];
    quizName;
    duplicateCourse = false;
    classId;
    quizPassId;
    editQuizId;

    @Output() upload = new EventEmitter<object>();
    @Output() completed = new EventEmitter<string>();
    @Input() addedFiles;
    @Input() selectedTab;
    userData;
    resortId;
    previousUrl;
    fileExist = false;
    existingFile = [];
    roleId;
    uploadPermission = true;
    modalConfig;
    deleteFileData;
    deleteFileIndex;
    preview = false;
    previewId;
    // selectedCourseIds:any;

    constructor(private breadCrumbService: BreadCrumbService, private fileService: FileService, private modalService: BsModalService, private utilService: UtilService, private courseService: CourseService, private headerService: HeaderService, private elementRef: ElementRef, private toastr: ToastrService, public moduleVar: ModuleVar, private route: Router, private commonService: CommonService, private http: HttpService, private activatedRoute: ActivatedRoute, private alertService: AlertService, public commonLabels: CommonLabels, private permissionService: PermissionService) {
        // this.activatedRoute.params.subscribe((params: Params) => {
        //     this.moduleId = params['moduleId'];
        // });
        this.activatedRoute.queryParams.subscribe((params) => {
            this.duplicateCourse = params.duplicate ? true : false;
            this.classId = params.classId ? params.classId : '';
            this.moduleId = params.moduleId ? params['moduleId'] : '';
            this.preview = params.preview ? true : false;
            this.preview && (this.previewId = params.previewId ? params.previewId : '');
        });
        this.userData = this.utilService.getUserData();
        this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
        if (window.location.pathname.indexOf("module")) {
            this.selectedTab = 'course';
        }
        this.labels = moduleVar.labels;
        this.moduleVar.title = this.moduleId ? this.commonLabels.labels.editCourse : this.commonLabels.labels.createCourse;

    }

    ngOnChanges() {
        this.breadScrumUpdate();
    }

    ngOnInit() {
        //this.resetForm();
        this.roleId = this.utilService.getRole();
        // this.breadScrumUpdate();
        if (!this.classId) {
            this.getquizList();
        }

        this.appendFilesToVideoList(this.addedFiles);

        this.moduleVar.api_url = API_URL.URLS;
        this.moduleVar.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'value',
            enableCheckAll: false,
            itemsShowLimit: 8,
            allowSearchFilter: true,
            searchPlaceholderText: "Search",
            clearSearchFilter: true
            // allowSearchFilter: true
        };
        this.addButton = setInterval(() => {
            this.includeDropdwnButton();
        }, 2000);
        this.moduleVar.tabKey = 1;
        if (this.duplicateCourse) {
            this.headerService.setTitle({ title: 'Duplicate', hidemodule: false });
        }
        if (this.classId) {
            let data = { id: this.classId };
            this.updateCourse(data, '');
        }
        else {
            // let curComp = this.fileService.getCurrentCompname();
            // if(curComp != 'class'){
            //     this.resetData();
            // }   
            // let currentUrl = this.route.url;
            this.route.events.filter(event => event instanceof NavigationEnd)
                .subscribe(e => {
                    //   this.previousUrl = e.url;
                    this.resetData();
                    this.fileService.emptyLocalFileList();
                    this.fileService.saveFileList();
                    this.addedFiles = [];
                });
            this.courseData('');
        }
        if (this.previewId) {
            let obj = { id: this.previewId }
            this.updateCourse(obj, '');
        }
    }

    breadScrumUpdate() {
        if (this.duplicateCourse) {
            let data = [{ title: this.commonLabels.labels.duplicate, url: '/cms-library' }, { title: this.commonLabels.labels.duplicateCourse, url: '' }];
            this.breadCrumbService.setTitle(data);
            if (this.roleId == 4 && !this.permissionService.uploadPermissionCheck('Course')) {
                this.uploadPermission = false;
            }
        }
        else if (this.selectedTab == 'course') {
            let data = this.moduleId ? [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.editCourse, url: '' }] : [{ title: this.commonLabels.btns.create, url: '/cmspage' }, { title: this.commonLabels.labels.createCourse, url: '' }];
            this.breadCrumbService.setTitle(data);
            if (this.roleId == 4 && !this.permissionService.uploadPermissionCheck('Course')) {
                this.uploadPermission = false;
                this.alertService.warn("Sorry Your file upload permission is disabled")
            }
            else {
                this.uploadPermission = true;
            }
        }
        else if (this.selectedTab == 'class') {
            if (this.roleId == 4 && !this.permissionService.uploadPermissionCheck('Training Class')) {
                this.uploadPermission = false;
                this.alertService.warn("Sorry Your file upload permission is disabled")
            }
            else {
                this.uploadPermission = true;
            }
            if (this.classId) {
                let data = [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.editClasses, url: '' }];
                this.breadCrumbService.setTitle(data);
            }
            else {
                let data = this.moduleId ? [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.editClasses, url: '' }] : [{ title: this.commonLabels.btns.create, url: '/cmspage' }, { title: this.commonLabels.labels.createClasses, url: '' }];
                this.breadCrumbService.setTitle(data);
            }
        }
    }

    // KR added this functionality 
    // sepearte function created from ng onit - which is called for added files in create and edit training class
    appendFilesToVideoList(addedFiles) {
        if (addedFiles && addedFiles.length > 0) {
            let courseName = this.moduleVar.selectCourseName;
            this.addCourse();
            this.moduleVar.selectCourseName = courseName;
            this.addedFiles.map(element => {
                this.moduleVar.videoList.push(element)
            })
        }
    }

    includeDropdwnButton() {
        if (this.selectedTab == 'course') {
            var myEl = document.querySelector('ul.item1');
            myEl.innerHTML = ' <span class="newCourseId addcourse" (click)="addCourse()" id="newCourseId"><i class="fa fa-plus pr-2"></i> <span class="addnewcourse-title">Add New Training Class</span></span>';
            let ele = this.elementRef.nativeElement.querySelector('.newCourseId');
            ele.onclick = this.addCourse.bind(this);
        }
    }
    courseData(classId) {
        let user = this.utilService.getUserData();
        let roleId = this.utilService.getRole();
        let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
        let query = "?resortId=" + resortId;
        //    "?createdBy="+user.userId
        this.courseService.getDropTrainingClassList(query).subscribe((resp) => {
            if (resp && resp.isSuccess) {
                this.moduleVar.courseList = resp.data && resp.data.rows.length && resp.data.rows.map(item => {
                    let obj = {
                        id: item.trainingClassId,
                        value: item.trainingClassName
                    }
                    return obj;
                })
                if (this.moduleId) {
                    let id = classId ? classId : '';
                    this.geteditCourseData(id);
                }
            }
        })
    }
    geteditCourseData(dataId) {
        this.courseService.getCourseById(this.moduleId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let data = resp.data && resp.data.rows.length && resp.data.rows[0];
                this.moduleVar.moduleName = data.courseName;
                this.moduleVar.selectedCourseIds = data && data.CourseTrainingClassMaps.map(item => { return item.trainingClassId })
                this.moduleVar.selectedCourse = data && data.CourseTrainingClassMaps.map(item => {
                    let obj = {
                        id: item.trainingClassId,
                        value: item.TrainingClass.trainingClassName
                    }
                    return obj;
                });
                this.selectedQuiz = data.CourseTrainingClassMaps.length && data.CourseTrainingClassMaps[0].TrainingClass.QuizMappings[0].quizId;
                // this.selectedQuiz = data && data.CourseTrainingClassMaps
                if (dataId !== '') {
                    let checkId = this.moduleVar.selectedCourseIds.find(x => x === dataId);
                    if (!checkId) {
                        this.moduleVar.selectedCourseIds.push(dataId);
                        this.moduleVar.courseList.forEach(item => {
                            if (item.id === dataId) {
                                this.moduleVar.selectedCourse.push(item);
                            }
                        })
                    }
                }
            }
        })
    }

    resetForm() {
        this.moduleVar.selectCourseName = '';
        this.moduleVar.selectVideoName = '';
        this.moduleVar.description = '';
        this.moduleVar.videoList = [];
        // this.fileService.emptyFileList();
    }

    onItemSelect(item: any) {
        this.moduleVar.selectedCourseIds = this.moduleVar.selectedCourse.map(item => { return item.id })
    }
    onItemDeselect(item: any) {
        this.moduleVar.selectedCourseIds = this.moduleVar.selectedCourse.map(item => { return item.id })
        if (item.value === this.moduleVar.selectCourseName || this.moduleVar.selectedCourse.length === 0) {
            this.moduleVar.tabEnable = false;
        }
    }


    showCMSLibrary() {
        // if(this.moduleVar.videoList){
        //     this.moduleVar.videoList.map(item =>{
        //         this.fileService.sendFileList('add', item);
        //     })
        // }

        let obj = {
            'value': true,
            'key': 'course'
        }
        this.upload.emit(obj);
    }



    fileUpload(e) {
        this.showImage = true;
        let self = this;
        this.fileExist = false;
        let reader = new FileReader();
        var duration;
        if (e.target && e.target.files[0]) {
            let file = e.target.files[0];
            if (this.moduleVar.existingFile.length) {
                this.moduleVar.existingFile.forEach(item => {
                    if (item == file.name) {
                        this.fileExist = true;
                        this.moduleVar.videoFile = '';
                        file = '';
                        this.alertService.warn(this.commonLabels.msgs.fileExist)
                    }
                })
            }
            if (!this.fileExist) {
                this.moduleVar.existingFile.push(file.name)
                // find video duration
                var video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = function () {
                    window.URL.revokeObjectURL(video.src);
                    duration = video.duration;
                    self.fileDuration = duration;
                }
                video.src = URL.createObjectURL(file);
                document.querySelector("#video-element source") && document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
                // find file extension
                this.uploadFile = file;
                let type = file.type;
                let typeValue = type && type.split('/');
                let extensionType = typeValue && typeValue.length && typeValue[1].split('.').pop();
                if (!extensionType || typeValue && typeValue.length && typeValue[0].split('.').pop() === 'image' && extensionType === 'gif' || extensionType === 'csv' || extensionType === 'x-msdownload') {
                    this.alertService.error(this.commonLabels.mandatoryLabels.fileformate)
                    this.moduleVar.videoFile = '';
                }
                else {
                    this.moduleVar.fileExtension = extensionType;
                    this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
                    if (this.fileExtensionType === 'Video') {
                        this.filePreviewImage(file);
                        if (e.target.files) {
                            Array.prototype.slice.call(e.target.files).forEach(function (file) {
                                new FileUploadThumbnail({
                                    maxWidth: 500,
                                    maxHeight: 500,
                                    file: file,
                                    onSuccess: function (src) {
                                        let date = new Date().valueOf();
                                        let text = '';
                                        let possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                                        for (let i = 0; i < 5; i++) {
                                            text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
                                        }
                                        // Replace extension according to your media type
                                        let imageName = date + text + '.jpeg';
                                        // call method that creates a blob from dataUri
                                        // self.previewImage = src;
                                        let encode = window.btoa(src)
                                        let imageBlob = self.dataURItoBlob(encode);
                                        self.fileImageDataPreview = new File([imageBlob], imageName, { type: 'image/jpeg' });
                                    }
                                }).createThumbnail();
                            });
                        }
                    }
                    let fileType = typeValue[0];
                    this.fileName = file.name;
                    reader.onloadend = () => {
                        this.fileUrl = reader.result;
                        if (fileType === 'application') {
                            let appType = (this.fileName.split('.').pop()).toString();
                            let appDataType = appType.toLowerCase();
                            this.extensionUpdate(appDataType, '');
                        }
                        else {
                            this.extensionTypeCheck(fileType, extensionType, this.fileUrl);
                        }
                    }
                }
                reader.readAsDataURL(file);
            }
        }
    }

    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/jpeg' });
        return blob;
    }

    filePreviewImage(file) {
        let self = this;
        var fileReader = new FileReader();
        fileReader.onload = function () {
            var blob = new Blob([fileReader.result], { type: file.type });
            var url = URL.createObjectURL(blob);
            var video = document.createElement('video');
            var timeupdate = function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                }
            };
            video.addEventListener('loadeddata', function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                }
            });
            var snapImage = function () {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                var image = canvas.toDataURL();
                var success = image.length > 100000;
                if (success) {
                    var img = document.querySelector('.thumbnail_img');
                    img.setAttribute('src', image);
                    URL.revokeObjectURL(url);
                }
                return success;
            };
            video.addEventListener('timeupdate', timeupdate);
            video.preload = 'metadata';
            video.src = url;
            // url = video.src; 
            fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    // self.fileImageDataPreview = new File([blob], "File_name.png");
                    // self.fileImageDataPreview.type = "image/png";
                })
            // Load video in Safari / IE11
            video.muted = true;
            //video.playsInline = true;
            video.play();
        };
        fileReader.readAsArrayBuffer(file);
    }

    extensionTypeCheck(fileType, extensionType, data) {
        switch (fileType) {
            case "video":
                this.previewImage = "";
                break;
            case "image":
                this.previewImage = data;
                break;
            case "text":
                this.previewImage = this.commonLabels.imgs.text;
                break;
            case "mp4":
                this.previewImage = API.API_ENDPOINT + "/uploads/" + data.fileImage;
                break;
            case "png":
            case "jpeg":
                this.previewImage = API.API_ENDPOINT + "/uploads/" + data.fileUrl;
                break;
            case "application":
                if (extensionType === "ms-powerpoint") {
                    this.previewImage = this.commonLabels.imgs.ppt;
                }
                else if (extensionType === "pdf") {
                    this.previewImage = this.commonLabels.imgs.pdf;
                }
                else if (extensionType === "sheet" || extensionType === 'ms-excel') {
                    this.previewImage = this.commonLabels.imgs.excel;
                }
                else if (extensionType === "document" || extensionType === 'msword') {
                    this.previewImage = this.commonLabels.imgs.doc;
                }
                else if (extensionType === "zip") {
                    this.previewImage = this.commonLabels.imgs.filezip;
                }
                break;
        }

    }

    updateCourse(data, i) {
        if (this.staticTabs) {
            this.staticTabs.tabs[0].disabled = false;
            this.staticTabs.tabs[0].active = true;
        }
        //this.moduleVar.quizDetails = [];
        // hided below line now
        // this.quizName = '';
        // hided above line now
        this.moduleVar.courseId = data.id;
        //    this.selectedQuiz = ;
        this.courseService.getFilesByTCId(data.id).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let classData = resp.data.file;
                this.moduleVar.selectCourseName = classData && classData.length && classData[0].TrainingClass && classData[0].TrainingClass.trainingClassName;
                let preAddedFiles = [];
                preAddedFiles = this.fileService.selectedFiles();
                if (preAddedFiles && preAddedFiles.length > 0) {
                    this.addedFiles = preAddedFiles;
                    this.appendFilesToVideoList(preAddedFiles);
                } else {
                    this.moduleVar.videoList = classData.map(items => {
                        let fileArr = items.File;
                        fileArr['addNew'] = true;
                        fileArr['selected'] = true;
                        //return items.File 
                        this.fileService.sendFileList('add', fileArr);
                        return fileArr;
                    });
                    this.fileService.saveFileList();
                }
                this.moduleVar.tabEnable = true;
            }
        });

        // this.courseService.getCourseTrainingClassById(data.id, this.moduleId).subscribe(resp => {
        //     if (resp && resp.isSuccess) {
        //         let classData = resp.data && resp.data.rows.length && resp.data.rows[0];
        //         this.moduleVar.selectCourseName = classData.trainingClassName;
        //         let preAddedFiles = this.fileService.selectedFiles();

        //         if(preAddedFiles && preAddedFiles.length > 0){
        //             this.addedFiles = preAddedFiles;
        //             this.appendFilesToVideoList(preAddedFiles);
        //         }else{
        //             this.moduleVar.videoList = classData.FileMappings && classData.FileMappings.length && classData.FileMappings.map(items => { 
        //                 let fileArr  = items.File;
        //                 fileArr['addNew'] = true;
        //                 fileArr['selected'] = true;
        //                 // return items.File 
        //                 this.fileService.sendFileList('add',fileArr);
        //                 return fileArr;
        //             });
        //             this.fileService.saveFileList();
        //         }
        //         this.moduleVar.tabEnable = true;
        //     }
        //     else {
        //         this.alertService.error(this.commonLabels.labels.nodataFound)
        //     }
        // });

        this.getEditQuizData(data);
        this.cancelVideoSubmit();
    }

    getEditQuizData(data) {
        let self = this;
        this.courseService.getTrainingClassQuiz(data.id, '').subscribe(response => {
            if (response && response.isSuccess) {
                this.quizCheck = true;
                let quizData = response.data && response.data.quiz[0];
                let questions = quizData && quizData.Questions && quizData.Questions.length ? quizData.Questions : [];
                this.quizName = quizData && quizData.quizName ? quizData.quizName : '';
                this.editQuizId = quizData && quizData.quizId ? quizData.quizId : '';
                this.quizPassId =quizData && quizData.quizId ? quizData.quizId : '';
                localStorage.setItem('QuizPassId', this.quizPassId);
                this.moduleVar.quizDetails = questions;
                if (self.quiz) {
                    self.quiz.quizDetails = questions;
                    self.quiz.questionForm = questions;
                    self.quiz.tempQuizEdit = questions;
                    self.quiz.enableQuiz = true;
                }
            }
        })
    }

    removeVideo() {
        let data = this.deleteFileData;
        let i = this.deleteFileIndex;
        this.fileService.sendFileList('remove', data);
        if (this.moduleVar.courseId && data.fileId) {
            this.removedFileIds.push(data.fileId);
        }
        else {
            this.messageClose();
            let dataContent
            if (data.jobId) {
                dataContent =
                    {
                        "fileName": data.fileUrl,
                        "jobId": data.jobId ? data.jobId : '',
                        "path": data.filePath ? data.filePath : "/uploads/" + data.fileUrl
                    }
            }
            else {
                dataContent = data.filePath ? data.filePath : "/uploads/" + data.fileUrl;
            }
            //filepath to delete documents uploaded from Desktop & fileUrl is to del doc uploaded from RL.  
            this.commonService.removeFiles(dataContent).subscribe(result => {
                if (result && result.isSuccess) {
                    this.alertService.success(this.commonLabels.msgs.fileRemoved)
                }
            })
        }
        this.moduleVar.videoList.splice(i, 1);
        this.closeDeletePopup();
    }

    openDeleteModal(template: TemplateRef<any>, item, i) {
        let modalConfig = {
            class: "modal-dialog-centered"
        }
        this.modalRef = this.modalService.show(template, modalConfig);
        this.deleteFileData = item;
        this.deleteFileIndex = i;
    }

    closeDeletePopup() {
        this.deleteFileData = '';
        this.deleteFileIndex = '';
        this.modalRef.hide();
    }

    hideTrainingClass(event) {
        if (event) {
            this.moduleVar.tabEnable = true;
            setTimeout(() => {
                if (event && this.staticTabs) {
                    this.staticTabs.tabs[1].disabled = false;
                    this.staticTabs.tabs[1].active = true;
                }
            }, 500);
        }
    }

    hideTab(data) {
        this.moduleVar.courseId = data.changeTC ? "" : this.moduleVar.courseId;
        this.moduleVar.selectedCourse = data.changeTC ? [] : this.moduleVar.selectedCourse;
        if (this.moduleVar.courseId) {
            this.courseData(this.moduleVar.courseId);
            this.moduleVar.tabEnable = data.courseUpdate ? false : true;
            data.courseUpdate ? this.submitForm(true) : this.submitForm(false);
            this.message = data.type ? this.commonLabels.labels.updateCourseSuccess : this.commonLabels.labels.addCourseSuccess;
            this.alertService.success(this.message);
            this.messageClose();
            this.fileService.emptyFileList();
        }
        else {
            this.messageClose();
            this.courseSubmitted = true;
            this.courseData('');
            this.moduleVar.quizDetails = [];
            this.moduleVar.quizDetails = [];
            let newTrainingClass = {
                id: data.resp && data.resp.trainingClass ? data.resp.trainingClass.trainingClassId : '',
                value: data.resp && data.resp.trainingClass ? data.resp.trainingClass.trainingClassName : ''
            }
            this.moduleVar.selectedCourseIds = [];
            if (newTrainingClass.id !== '') {
                this.moduleVar.selectedCourse.push(newTrainingClass);
                this.moduleVar.selectedCourse.length ? this.moduleVar.selectedCourseIds = this.moduleVar.selectedCourse.map(item => { return item.id }) : this.moduleVar.selectedCourseIds.push(newTrainingClass.id);
                data.courseUpdate ? this.submitForm(true) : this.submitForm(false);
            }
            // data.submitCheck ? this.submitForm(true) :this.courseData(); 
            if (this.moduleVar.selectCourseName) {
                this.moduleVar.tabEnable = data.courseUpdate ? false : true;
                this.message = data.type ? this.labels.updateCourseSuccess : this.labels.addCourseSuccess;
                this.alertService.success(this.message);
                this.fileService.emptyFileList();
            }
        }
    }

    resetClassWidget() {
        this.moduleVar.courseList = [];
        this.moduleVar.selectedCourseIds = [];
        this.moduleVar.selectedCourse = [];

    }

    messageClose() {
        this.message = '';
        this.videoMessage = '';
        this.removedFileIds = [];
    }

    updateVideo(data, i) {
        this.fileId = data.fileId;
        this.showImage = true;
        this.moduleVar.selectVideoName = data.fileName;
        this.moduleVar.description = data.fileDescription;
        this.moduleVar.videoFile = data.fileUrl;
        // this.previewImage = data.url;
        this.moduleVar.videoIndex = i + 1;
        let index = (this.moduleVar.videoList.findIndex(item => item.fileName === data.fileName));
        this.moduleVar.videoId = index + 1
        if (this.quiz) {
            this.quizCheck = false;
            this.quiz.editQuizDetails(this.moduleVar.quizDetails);
        }
        let fileExtension = data.fileUrl.split('.').pop();
        this.extensionUpdate(fileExtension, data);
    }

    extensionUpdate(type, data) {
        switch (type) {
            case "ppt":
                this.previewImage = this.commonLabels.imgs.ppt;
                break;
            case "pdf":
                this.previewImage = this.commonLabels.imgs.pdf;
                break;
            case "txt":
                this.previewImage = this.commonLabels.imgs.text;
                break;
            case "mp4":
                // this.previewImage = API.API_ENDPOINT + "8103/uploads/" + data.fileImage;
                this.previewImage = null;
                break;
            case "png":
            case "jpg":
                this.previewImage = API.API_ENDPOINT + "8103/uploads/" + data.fileUrl;
                break;
            case "docx":
                this.previewImage = this.commonLabels.imgs.doc;
                break;
            case "doc":
                this.previewImage = this.commonLabels.imgs.doc;
                break;
            case "xlsx":
                this.previewImage = this.commonLabels.imgs.excel;
                break;
            case "xls":
                this.previewImage = this.commonLabels.imgs.excel;
                break;
            case "zip":
                this.previewImage = this.commonLabels.imgs.filezip;
                break;
        }
    }

    addCourse() {
        this.resetTabDetails(true);
    }

    resetTabDetails(add) {
        this.moduleVar.tabEnable = add ? true : false;
        this.moduleVar.videoList = [];
        this.moduleVar.selectCourseName = '';
        this.moduleVar.selectVideoName = '';
        this.moduleVar.description = '';
        this.moduleVar.videoFile = '';
        this.moduleVar.courseIndex = '';
        //this.moduleVar.courseId = '';
        this.moduleVar.videoId = '';
        this.message = '';
        this.videoMessage = '';
        this.quizName = '';
        this.courseSubmitted = false;
        if (this.quiz && add) {
            let data = [];
            this.quizCheck = false;
            this.courseSubmitted = false;
            if (this.quiz && add) {
                let data = [];
                this.quizCheck = false;
                this.courseSubmitted = false;
                this.videoSubmitted = false;
                this.moduleVar.quizDetails = [];
                this.quiz.editQuizDetails(data);
            }
        }
    }

    videoSubmit() {
        // this.messageClose();
        this.message = '';
        this.videoMessage = '';
        let self = this;
        this.videoSubmitted = true;
        let videoObj;
        this.moduleVar.courseId ? videoObj = { fileName: self.moduleVar.selectVideoName, fileDescription: self.moduleVar.description, fileUrl: '', fileType: this.fileExtensionType, fileExtension: this.moduleVar.fileExtension, fileImage: '', filePath: '', fileSize: '', fileLength: this.fileDuration, trainingClassId: this.moduleVar.courseId } :
            videoObj = { fileName: self.moduleVar.selectVideoName, fileDescription: self.moduleVar.description, fileUrl: '', fileType: this.fileExtensionType, fileExtension: this.moduleVar.fileExtension, fileImage: '', filePath: '', fileSize: '', fileLength: this.fileDuration }
        if (this.uploadFile && this.moduleVar.selectVideoName && this.permissionService.nameValidationCheck(this.moduleVar.selectVideoName) && this.moduleVar.description && this.moduleVar.videoFile) {
            this.message = this.moduleVar.courseId !== '' ? (this.commonLabels.labels.videoUpdatedToast) : (this.commonLabels.labels.videoAddedToast);
            if (videoObj.fileType === 'Video') {
                this.videoFileUpload(videoObj);
            }
            else {
                this.commonService.uploadFiles(this.uploadFile).subscribe((result) => {
                    if (result && result.isSuccess) {
                        this.clearData();
                        self.filePath = result.path && result.path;
                        self.alertService.success(this.message);
                        self.videoSubmitted = false;
                        videoObj.fileUrl = result.data && result.data[0].filename;
                        videoObj.fileSize = result.data.length && result.data[0].size;
                        this.fileId ? videoObj.fileId = this.fileId : '';
                        videoObj.filePath = result.path && result.path;
                        if (self.moduleVar.videoIndex) {
                            let index = self.moduleVar.videoIndex - 1;
                            self.moduleVar.videoList[index] = videoObj;
                            self.moduleVar.videoIndex = 0;
                        }
                        else {
                            self.moduleVar.videoList.push(videoObj);
                        }
                        this.fileService.sendFileList('add', videoObj);
                        this.fileId = '';

                    }
                })
            }


        } else if (this.fileId && !this.uploadFile) {
            let postData = {
                fileName: this.moduleVar.selectVideoName,
                fileDescription: this.moduleVar.description
            }
            this.commonService.updateFiles(this.fileId, postData).subscribe(res => {
                if (res.isSuccess) {
                    this.videoSubmitted = false;
                    this.alertService.success(res.message);
                    let videoObj = {
                        fileName: this.moduleVar.selectVideoName,
                        fileDescription: this.moduleVar.description,
                        fileUrl: this.moduleVar.videoFile,
                        fileId: this.fileId
                    }
                    if (this.moduleVar.videoIndex) {
                        const index = this.moduleVar.videoIndex - 1;
                        this.moduleVar.videoList[index] = videoObj;
                    }
                    this.clearData();
                    this.fileId = '';
                    //   this.clearData();
                }
            })
        }
        else {
            this.alertService.error(this.commonLabels.labels.mandatoryFields);
        }
    }

    videoFileUpload(videoObj) {
        let self = this;
        this.commonService.videoUploadFiles(this.uploadFile).subscribe((result) => {
            if (result && result.isSuccess) {
                this.clearData();
                if (videoObj.fileType === 'Video') {
                    self.commonService.uploadFiles(self.fileImageDataPreview).subscribe((resp) => {
                        let fileImagePath = resp.data && resp.data[0].path;
                        videoObj.fileImage = resp.data && resp.data[0].filename;
                    })
                }
                self.filePath = result.path && result.path;
                self.alertService.success(this.message);
                self.videoSubmitted = false;
                videoObj.fileUrl = result.data && result.data[0].filename;
                videoObj.fileSize = result.data.length && result.data[0].size;
                videoObj.inputUrl = result.inputLocation ? result.inputLocation : '';
                videoObj.transcodeUrl = result.outputLocation ? result.outputLocation : '';
                videoObj.jobId = result.transcode && result.transcode.Job ? result.transcode.Job.Id : '';
                this.fileId ? videoObj.fileId = this.fileId : '';
                videoObj.filePath = result.path && result.path;
                if (self.moduleVar.videoIndex) {
                    let index = self.moduleVar.videoIndex - 1;
                    self.moduleVar.videoList[index] = videoObj;
                    self.moduleVar.videoIndex = 0;
                }
                else {
                    self.moduleVar.videoList.push(videoObj);
                }
                this.fileService.sendFileList('add', videoObj);
                this.fileId = '';

            }
        })
    }

    clearData() {
        this.moduleVar.selectVideoName = '';
        this.moduleVar.description = '';
        this.moduleVar.videoFile = '';
        this.showImage = false;
        this.previewImage = '';
        this.fileName = '';
        this.fileExtensionType = '';
    }

    cancelVideoSubmit() {
        this.moduleVar.selectVideoName = '';
        this.moduleVar.description = '';
        this.moduleVar.videoFile = '';
        this.previewImage = '';
        this.fileId = '';
        this.moduleVar.videoIndex = 0;
    }
    resetData() {
        this.clearData();
        this.cancelVideoSubmit();
        this.moduleVar.quizDetails = [];
        this.moduleVar.selectCourseName = '';
        this.moduleVar.videoList = [];
        this.moduleVar.courseId = '';
        this.moduleVar.moduleName = '';
        this.moduleVar.tabEnable = false;
        this.moduleVar.selectedCourse = [];
        this.moduleVar.existingFile = [];
        this.fileExist = false;
    }

    checkValidation() {
        // let validation = this.moduleVar.moduleList.find(x => x.moduleName === this.moduleVar.moduleName);
        // if (validation) {
        //     this.moduleVar.moduleNameCheck = this.moduleId ? (parseInt(this.moduleId) !== validation.moduleId ? true : false) : true;
        // }
        // else {
        //     this.moduleVar.moduleNameCheck = false;
        // }
        let params = {
            courseName: this.moduleVar.moduleName,
            resortId: this.resortId
        }
        this.courseService.courseCheck(params).subscribe(resp => {
            if (resp.isSuccess) {
                this.moduleVar.moduleNameCheck = false;
            }
            else {
                this.moduleVar.moduleNameCheck = true;
            }
        }, err => {
            this.alertService.error(err.error.error)
        })

    }

    tabChange() {
        this.courseSubmitted = true;
        if (this.moduleVar.selectCourseName && this.moduleVar.videoList.length) {
            this.staticTabs.tabs[1].disabled = false;
            this.staticTabs.tabs[1].active = true;
        }
        else if (!this.moduleVar.selectCourseName) {
            this.alertService.error(this.commonLabels.mandatoryLabels.courseNameError);
        }
        else if (!this.moduleVar.videoList.length) {
            this.alertService.error(this.commonLabels.mandatoryLabels.videoError);
        }
    }

    goTocmsLibrary() {
        if (this.moduleId) {
            this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'course' } })
        }
        else {
            this.completed.emit('back');
        }
    }

    getquizList() {
        let user = this.utilService.getUserData();
        let roleId = this.utilService.getRole();
        let query = roleId != 1 ? '?createdBy=' + user.userId : '';
        this.courseService.getQuizList(query).subscribe(res => {
            if (res.isSuccess) {
                this.quizList = res.data;
            }
        })
    }


    submitForm(courseSubmitType) {
        this.moduleSubmitted = true;
        let user = this.utilService.getUserData();
        if (this.permissionService.nameValidationCheck(this.moduleVar.moduleName) && this.moduleVar.selectedCourse.length) {
            let params = {
                "courseName": this.moduleVar.moduleName,
                // "quizId": this.selectedQuiz, 
                "courseTrainingClasses": this.moduleVar.selectedCourseIds,
                "createdBy": user.userId,
                "resortId": this.resortId,
                "status": courseSubmitType ? 'none' : 'workInprogress',
                "draft": false
            }
            if ((this.moduleCourseId || this.moduleId) && !this.duplicateCourse) {
                let id = this.moduleCourseId ? this.moduleCourseId : this.moduleId;
                this.courseService.updateCourse(id, params).subscribe((resp) => {
                    if (resp && resp.isSuccess) {
                        this.modalRef && this.modalRef.hide();
                        if (this.moduleId) {
                            courseSubmitType ? this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'course' } }) : this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'workInprogress' } })
                            this.moduleId = '';
                        }
                        else if (this.classId) {
                            this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'class' } })
                            this.classId = '';
                        }
                        else {
                            if (courseSubmitType) {
                                this.moduleCourseId = '';
                                this.completed.emit('completed');
                            }
                            else {
                                this.staticTabs.tabs[0].disabled = false;
                                this.staticTabs.tabs[0].active = true;
                            }
                            this.route.navigate(['/cmspage'], { queryParams: { type: 'create' } });
                        }
                        this.alertService.success(this.commonLabels.labels.moduleUpdateMsg);
                        this.moduleSubmitted = false;
                        this.fileService.emptyFileList();

                    }
                }, err => {
                    this.modalRef && this.modalRef.hide();
                    this.alertService.error(err.error.error);
                })
            }
            else {

                let accessSet = this.utilService.getUserData() && this.utilService.getUserData().accessSet == 'ApprovalAccess' ? true : false;
                if (this.roleId == 4 && accessSet) {
                    params.draft = true
                }
                else {
                    delete params.draft;
                }
                this.courseService.addCourse(params).subscribe((resp) => {
                    if (resp && resp.isSuccess) {
                        if (this.duplicateCourse) {
                            this.duplicateCourse = false;
                            this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'course' } })
                        }
                        else if (courseSubmitType) {
                            this.moduleCourseId = '';
                            // this.route.navigateByUrl("/cms-library");
                            this.completed.emit('completed');
                        }
                        else {
                            this.moduleCourseId = resp.data[0].courseId;
                            if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs.length) {
                                this.staticTabs.tabs[0].disabled = false;
                                this.staticTabs.tabs[0].active = true;
                            }
                        }
                        if (!this.moduleVar.tabEnable) {
                            this.modalRef && this.modalRef.hide();
                        }
                        this.route.navigate(['/cmspage'], { queryParams: { type: 'create' } });
                        this.alertService.success(this.commonLabels.labels.moduleCreateMsg);
                        this.moduleSubmitted = false;
                        this.fileService.emptyFileList();
                    }
                }, err => {
                    this.modalRef && this.modalRef.hide();
                    this.alertService.error(err.error.error);
                });
            }
        }
        else if (!this.permissionService.nameValidationCheck(this.moduleVar.moduleName) || this.moduleVar.moduleName) {
            this.alertService.error(this.commonLabels.mandatoryLabels.courseName)
        }
        else if (!this.moduleVar.selectedCourse.length) {
            this.alertService.error(this.commonLabels.labels.courseError)
        }
    }

    redirectCourseList() {
        this.route.navigateByUrl('/cms-library');
    }

    openEditModal(template: TemplateRef<any>, modelValue) {
        if (this.moduleVar.moduleName && this.permissionService.nameValidationCheck(this.moduleVar.moduleName) && this.moduleVar.selectedCourseIds.length) {
            let modalConfig = {
                class: "modal-dialog-centered"
            }
            this.modalRef = this.modalService.show(template, modalConfig);
        }
        else if (!this.moduleVar.moduleName || !this.permissionService.nameValidationCheck(this.moduleVar.moduleName)) {
            this.alertService.error(this.commonLabels.labels.pleaseaddCourse);
        } else if (!this.moduleVar.selectedCourseIds.length) {
            this.alertService.error(this.commonLabels.mandatoryLabels.trainingClassrequired);
        }
        // else if (!this.selectedQuiz) {
        //     this.alertService.error(this.commonLabels.mandatoryLabels.quizNameRequired);
        // }

    }

    ngOnDestroy() {
        if (this.addButton) {
            clearInterval(this.addButton);
        }
        // this.existingFile = [];
        this.fileExist = false;
        this.preview = false;
    }

    goToPreview() {
        // moduleId
        this.route.navigateByUrl('/viewCourse/' + this.moduleId);
    }
    permissionCheck(modules, type) {
        if (type == 'edit') {
            return this.permissionService.editPermissionCheck(modules);
        }
    }
}
