import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpService, HeaderService, UtilService, AlertService, CommonService, CourseService, BreadCrumbService, FileService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddQuizComponent } from '../add-quiz/add-quiz.component';
import { ModuleVar } from '../../Constants/module.var';
import { API_URL } from '../../Constants/api_url';
import { API } from '../../Constants/api';
import { CommonLabels } from '../../Constants/common-labels.var'

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
    videoSubmitted = false;;
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
    editQuizId;
    @Output() upload = new EventEmitter<object>();
    @Output() completed = new EventEmitter<string>();
    @Input() addedFiles;
    @Input() selectedTab;
    userData;
    resortId;
    // selectedCourseIds:any;

    constructor(private breadCrumbService: BreadCrumbService, private fileService: FileService, private modalService: BsModalService, private utilService: UtilService, private courseService: CourseService, private headerService: HeaderService, private elementRef: ElementRef, private toastr: ToastrService, public moduleVar: ModuleVar, private route: Router, private commonService: CommonService, private http: HttpService, private activatedRoute: ActivatedRoute, private alertService: AlertService, public commonLabels: CommonLabels) {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.moduleId = params['moduleId'];
        });
        this.activatedRoute.queryParams.subscribe((params) => {
            this.duplicateCourse = params.duplicate ? true : false;
            this.classId = params.classId ? params.classId : '';
        });
        this.userData = this.utilService.getUserData();
        this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
        if (window.location.pathname.indexOf("module")) {
            this.selectedTab = 'course';
        }
        this.labels = moduleVar.labels;
        this.moduleVar.title = this.moduleId ? this.commonLabels.labels.editCourse : this.commonLabels.labels.createCourse;
    }

    ngOnInit() {
        //this.resetForm();
        this.getquizList();
        if (this.addedFiles && this.addedFiles.length > 0) {
            let courseName = this.moduleVar.selectCourseName;
            this.addCourse();
            this.moduleVar.selectCourseName = courseName;
            this.addedFiles.map(element => {
                this.moduleVar.videoList.push(element)
            })
        }
        this.moduleVar.api_url = API_URL.URLS;
        this.moduleVar.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'value',
            enableCheckAll: false,
            itemsShowLimit: 8,
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
            // this.resetData();
            this.courseData('');
        }
    }

    ngDoCheck() {
        if (this.duplicateCourse) {
            let data = [{ title: this.commonLabels.labels.duplicate, url: '/cms-library' }, { title: this.commonLabels.labels.duplicateCourse, url: '' }];
            this.breadCrumbService.setTitle(data);
        }
        else if (this.selectedTab == 'course') {
            let data = this.moduleId ? [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.editCourse, url: '' }] : [{ title: this.commonLabels.btns.create, url: '/cmspage' }, { title: this.commonLabels.labels.createCourse, url: '' }];
            this.breadCrumbService.setTitle(data);
        }
        else if (this.selectedTab == 'class') {
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

   getClassDetails(){
       let query = '?trainingClassId='+this.classId;
    this.courseService.getTrainingClassList('','',query).subscribe(resp=>{
        if(resp && resp.isSuccess){
            let data = resp.data && resp.data.rows.length && resp.data.rows[0];
            this.updateCourse(data,'')
        }

    })
   }

    includeDropdwnButton(){
        if(this.selectedTab == 'course'){
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
       let query = "?resortId="+resortId;
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
                this.moduleName = data.courseName;
                this.moduleVar.selectedCourseIds = data && data.CourseTrainingClassMaps.map(item => { return item.trainingClassId })
                this.selectedCourses = data && data.CourseTrainingClassMaps.map(item => {
                    let obj = {
                        id: item.trainingClassId,
                        value: item.TrainingClass.trainingClassName
                    }
                    return obj;
                });
                this.selectedQuiz = data.CourseTrainingClassMaps[0].TrainingClass.QuizMappings[0].quizId;
                // this.selectedQuiz = data && data.CourseTrainingClassMaps
                if (dataId !== '') {
                    let checkId = this.moduleVar.selectedCourseIds.find(x => x === dataId);
                    if (!checkId) {
                        this.moduleVar.selectedCourseIds.push(dataId);
                        this.moduleVar.courseList.forEach(item => {
                            if (item.id === dataId) {
                                this.selectedCourses.push(item);
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
        this.moduleVar.selectedCourseIds = this.selectedCourses.map(item => { return item.id })
    }
    onItemDeselect(item: any) {
        this.moduleVar.selectedCourseIds = this.selectedCourses.map(item => { return item.id })
        if (item.value === this.moduleVar.selectCourseName || this.selectedCourses.length === 0) {
            this.tabEnable = false;
        }
    }


    showCMSLibrary() {
        let obj = {
            'value': true,
            'key': 'course'
        }
        this.upload.emit(obj);
    }

    fileUpload(e) {
        this.showImage = true;
        let self = this;
        let reader = new FileReader();
        var duration;
        if (e.target && e.target.files[0]) {
            let file = e.target.files[0];
            // find video duration
            var video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                duration = video.duration;
                self.fileDuration = duration;
            }
            video.src = URL.createObjectURL(file);

            document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(file));
            // find file extension
            this.uploadFile = file;
            let type = file.type;
            let typeValue = type.split('/');
            let extensionType = typeValue[1].split('.').pop();

            if (typeValue[0].split('.').pop() === 'image' && extensionType === 'gif') {
                this.alertService.error(this.commonLabels.mandatoryLabels.fileformate)
                this.moduleVar.videoFile = '';
            }
            else {
                this.moduleVar.fileExtension = extensionType;
                this.fileExtensionType = typeValue[0].split('.').pop() === "video" ? "Video" : "Document";
                if (this.fileExtensionType === 'Video') {
                    this.filePreviewImage(file);
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
                    self.fileImageDataPreview = new File([blob], "File_name.png");
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
            case "png" :
            case "jpeg" : 
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
        this.moduleVar.quizDetails = [];
        this.quizName = '';
        this.moduleVar.courseId = data.id;
        //    this.selectedQuiz = ;
        this.courseService.getCourseTrainingClassById(data.id, this.moduleId).subscribe(resp => {
            if (resp && resp.isSuccess) {
                let classData = resp.data && resp.data.rows.length && resp.data.rows[0];
                this.moduleVar.selectCourseName = classData.trainingClassName;
                this.moduleVar.videoList = classData.FileMappings && classData.FileMappings.length && classData.FileMappings.map(items => { return items.File });
                this.tabEnable = true;
            }
            else {
                this.alertService.error(this.commonLabels.labels.nodataFound)
            }
        })
        this.getEditQuizData(data);
        this.cancelVideoSubmit();
    }

    getEditQuizData(data) {
        this.courseService.getTrainingClassQuiz(data.id, '').subscribe(response => {
            if (response && response.isSuccess) {
                this.quizCheck = true;
                let quizData = response.data && response.data.quiz[0];
                let questions = quizData.QuizMappings && quizData.QuizMappings.length && quizData.QuizMappings.map(items => { return items.Question });
                this.quizName = quizData.quizName;
                this.editQuizId = quizData.quizId;
                this.moduleVar.quizDetails = questions;
            }
        })
    }

    removeVideo(data, i) {
        console.log(data);
        if (this.moduleVar.courseId && data.fileId) {
            this.removedFileIds.push(data.fileId);
        }
        else {
            this.messageClose();
            //filepath to delete documents uploaded from Desktop & fileUrl is to del doc uploaded from RL.
            let dataContent = data.filePath ? data.filePath : "/uploads/" + data.fileUrl;
            this.commonService.removeFiles(dataContent).subscribe(result => {
                if (result && result.isSuccess) {
                    this.alertService.success(this.commonLabels.msgs.fileRemoved)
                }
            })
        }
        this.moduleVar.videoList.splice(i, 1);
    }

    hideTrainingClass(event) {
        if (event) {
            this.tabEnable = true;
            setTimeout(() => {
                if (event && this.staticTabs) {
                    this.staticTabs.tabs[1].disabled = false;
                    this.staticTabs.tabs[1].active = true;
                }
            }, 500);
        }
    }

    hideTab(data) {
        if (this.moduleVar.courseId) {
            this.courseData(this.moduleVar.courseId);
            this.tabEnable = data.courseUpdate ? false : true;
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
                this.selectedCourses.push(newTrainingClass);
                this.moduleVar.selectedCourseIds.push(newTrainingClass.id);
                data.courseUpdate ? this.submitForm(true) : this.submitForm(false);
            }
            // data.submitCheck ? this.submitForm(true) :this.courseData(); 
            if (this.moduleVar.selectCourseName) {
                this.tabEnable = data.courseUpdate ? false : true;
                this.message = data.type ? this.labels.updateCourseSuccess : this.labels.addCourseSuccess;
                this.alertService.success(this.message);
                this.fileService.emptyFileList();
            }
        }
    }

    resetClassWidget() {
        this.moduleVar.courseList = [];
        this.moduleVar.selectedCourseIds = [];
        this.selectedCourses = [];

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

   extensionUpdate(type, data){
       switch(type){
        case "ppt":
            this.previewImage =  this.commonLabels.imgs.ppt;  
            break;
        case "pdf":
            this.previewImage =  this.commonLabels.imgs.pdf;
            break;
        case "txt":
            this.previewImage =  this.commonLabels.imgs.text; 
            break;
        case "mp4":
            this.previewImage = API.API_ENDPOINT + "8103/uploads/" + data.fileImage;
            break;         
        case "png" :
        case "jpg" : 
            this.previewImage = API.API_ENDPOINT + "8103/uploads/" + data.fileUrl;  
            console.log(this.previewImage,"preview");       
            break;
        case "docx":
            this.previewImage =  this.commonLabels.imgs.doc; 
            break;
        case "doc":
            this.previewImage =  this.commonLabels.imgs.doc; 
            break;
        case "xlsx":
            this.previewImage =  this.commonLabels.imgs.excel;
            break;
        case "xls":
            this.previewImage =  this.commonLabels.imgs.excel;
            break;     
        case "zip" :
            this.previewImage =  this.commonLabels.imgs.filezip;
            break;
       }
   }

   addCourse(){
    this.resetTabDetails(true);
   } 

   resetTabDetails(add){
    this.tabEnable = add ? true : false;
    this.moduleVar.videoList = [];
    this.moduleVar.selectCourseName = '';
    this.moduleVar.selectVideoName = '';
    this.moduleVar.description = '';
    this.moduleVar.videoFile = '';
    this.moduleVar.courseIndex = '';
    this.moduleVar.courseId = '';
    this.moduleVar.videoId = '';
    this.message = '';
    this.videoMessage = '';
    this.courseSubmitted = false;
    if(this.quiz && add){
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
        this.messageClose();
        let self = this;
        this.videoSubmitted = true;
        let videoObj;
        this.moduleVar.courseId ? videoObj = { fileName: self.moduleVar.selectVideoName, fileDescription: self.moduleVar.description, fileUrl: '', fileType: this.fileExtensionType, fileExtension: this.moduleVar.fileExtension, fileImage: '', filePath: '', fileSize: '', fileLength: this.fileDuration, trainingClassId: this.moduleVar.courseId } :
            videoObj = { fileName: self.moduleVar.selectVideoName, fileDescription: self.moduleVar.description, fileUrl: '', fileType: this.fileExtensionType, fileExtension: this.moduleVar.fileExtension, fileImage: '', filePath: '', fileSize: '', fileLength: this.fileDuration }
        if ( this.uploadFile && this.moduleVar.selectVideoName && this.moduleVar.description && this.moduleVar.videoFile) {
            this.message = this.moduleVar.courseId !== '' ? (this.commonLabels.labels.videoUpdatedToast) : (this.commonLabels.labels.videoAddedToast);
            this.commonService.uploadFiles(this.uploadFile).subscribe((result) => {
                if (result && result.isSuccess) {
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
                    
                }
            })
            this.clearData();
        }else if(this.fileId && !this.uploadFile){
            let postData={
                fileName:this.moduleVar.selectVideoName,
                fileDescription:this.moduleVar.description
            }
            this.commonService.updateFiles(this.fileId, postData).subscribe(res=>{
                if(res.isSuccess){
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
                }
            })
        }
        else {
            this.alertService.error(this.commonLabels.labels.mandatoryFields);
        }
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
        this.moduleVar.videoIndex = 0;
    }
    resetData() {
        this.clearData();
        this.cancelVideoSubmit();
        this.moduleVar.quizDetails = [];
        this.moduleVar.selectCourseName = '';
        this.moduleVar.videoList = [];
        this.moduleVar.courseId = '';
    }

    checkValidation() {
        let validation = this.moduleVar.moduleList.find(x => x.moduleName === this.moduleName);
        if (validation) {
            this.moduleVar.moduleNameCheck = this.moduleId ? (parseInt(this.moduleId) !== validation.moduleId ? true : false) : true;
        }
        else {
            this.moduleVar.moduleNameCheck = false;
        }

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

   getquizList(){
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let query = roleId !=1 ? '?createdBy='+user.userId : '';
       this.courseService.getQuizList(query).subscribe(res=>{
           if(res.isSuccess){
               this.quizList = res.data;
           }
       })
   }


    submitForm(courseSubmitType) {
        this.moduleSubmitted = true;
        let user = this.utilService.getUserData();
        if (this.moduleName && this.selectedCourses.length) {
            let params = {
                "courseName": this.moduleName,
                // "quizId": this.selectedQuiz, 
                "courseTrainingClasses": this.moduleVar.selectedCourseIds,
                "createdBy": user.userId,
                "resortId": this.resortId,
                "status": courseSubmitType ? 'none' : 'workInprogress'
            }
            if ((this.moduleCourseId || this.moduleId) && !this.duplicateCourse) {
                let id = this.moduleCourseId ? this.moduleCourseId : this.moduleId;
                this.courseService.updateCourse(id, params).subscribe((resp) => {
                    if (resp && resp.isSuccess) {
                        this.modalRef && this.modalRef.hide();
                        if (this.moduleId) {
                            this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'course' } })
                            this.moduleId = '';
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
                        }
                        this.route.navigate(['/cmspage'], { queryParams: { type: 'create' } });
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
                        if (!this.tabEnable) {
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
        else if (!this.moduleName) {
            this.alertService.error(this.commonLabels.mandatoryLabels.courseName)
        }
        else if (!this.selectedCourses.length) {
            this.alertService.error(this.commonLabels.labels.courseError)
        }
    }

    redirectCourseList() {
        this.route.navigateByUrl('/cms-library');
    }

    openEditModal(template: TemplateRef<any>, modelValue) {
        if (this.moduleName && this.moduleVar.selectedCourseIds.length) {
            let modalConfig = {
                class: "modal-dialog-centered"
            }
            this.modalRef = this.modalService.show(template, modalConfig);
        }
        else if (!this.moduleName) {
            this.alertService.error(this.commonLabels.labels.pleaseaddCourse);
        } else if (!this.moduleVar.selectedCourseIds.length) {
            this.alertService.error(this.commonLabels.mandatoryLabels.trainingClassrequired);
        } else if (!this.selectedQuiz) {
            this.alertService.error(this.commonLabels.mandatoryLabels.quizNameRequired);
        }

    }

    ngOnDestroy() {
        if (this.addButton) {
            clearInterval(this.addButton);
        }
    }

}
