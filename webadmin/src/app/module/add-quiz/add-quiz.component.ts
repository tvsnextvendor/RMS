import { Component, OnInit, Input, Output,ViewChild,EventEmitter, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService,UtilService } from '../../services';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { CourseService } from '../../services/restservices/course.service';
import { API_URL } from '../../Constants/api_url';
import { AlertService, FileService,PermissionService } from '../../services';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModuleDetailsComponent } from '../module-details/module-details.component';
import { CommonLabels } from '../../Constants/common-labels.var'
import { QuizService } from '../quiz.service';

@Component({
    selector: 'add-quiz',
    templateUrl: './add-quiz.component.html',
    styleUrls: ['./add-quiz.component.css']

})
export class AddQuizComponent implements OnInit {

    @Input() courseId;
    @Input() videoId;
    @Input() videoList;
    @Input() selectCourseName;
    @Input() quizDetails;
    @Input() enableQuiz;
    @Input() moduleName;
    @Input() moduleId;
    @Input() removedFileIds;
    @Input() tabName;
    @Input() quizNames;
    @Input() editQuizId;
    @Output() valueChange = new EventEmitter();
    @Output() completed = new EventEmitter();
    @Output() hideClass = new EventEmitter();
    courseUpdate = false;
    tcErr = false;
    videoDetails = [];
    // courseId;
    // videoId;
    questionForm;
    weightage;
    questionOptions = [];
    courseOptions = [];
    videoOptions = [];
    optionType = false;
    videoName;
    selectedVideo;
    selectedCourse;
    quizQuestionsForm = [];
    quizName;
    title;
    apiUrls;
    hidemodule = false;
    optionData = true;
    modalRef;
    removedQuizIds = [];
    questionList = [];
    quizCreateType;
    quizList=[];
    selectedQuiz = null;
    classId;
    userData;
    resortId;
    enableAddQuiz = false;
    roleId;
    updatedClassName;
    ownerShipErr = false;
    answerEmpty = false;
    optionEmpty = false;
    @ViewChild('tcNameChange') modalTemplate : TemplateRef<any>;


    constructor(private modalService: BsModalService, private fileService: FileService, private quizService: QuizService, private courseService: CourseService, private headerService: HeaderService, private alertService: AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public constant: QuizVar, private toastr: ToastrService,
        public commonLabels: CommonLabels,private utilService : UtilService,private permissionService :PermissionService) {
        this.apiUrls = API_URL.URLS;
        this.activatedRoute.queryParams.subscribe((params) => {
            this.classId = params.classId ? params.classId : '';
        });
        this.userData = this.utilService.getUserData();
        this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
    }

    ngOnInit() {
        this.quizService.selectedQuiz.subscribe(res => {
            this.questionList = res;
            if (res) {
                this.hideClass.emit(true);
            }
        })
        this.roleId = this.utilService.getRole();
        this.selectedVideo = this.videoId ? this.videoId : null;
        this.selectedCourse = this.courseId ? this.courseId : null;
        this.quizName = this.quizNames ? this.quizNames : '';
        this.quizCreateType = 'new';
        this.questionOptions = [
            { name: "MCQ", value: "MCQ" },
            { name: "True/False", value: "True/False" },
            { name: "Non-MCQ", value: "NON-MCQ" }
        ];
        this.quizQuestionsForm = [{
            // "questionId": 1,
            "questionName": "",
            "questionType": "MCQ",
            "options": [
                { "optionId": 1, "optionName": "" },
                { "optionId": 2, "optionName": "" },
                { "optionId": 3, "optionName": "" },
                { "optionId": 4, "optionName": "" }
            ],
            "weightage": '100',
            "answer": ''
        }];

        if(this.quizCreateType == 'new' || (this.quizCreateType == 'exist' && this.selectedQuiz)){
            this.enableAddQuiz = true;
        }
        if (this.enableQuiz) {
            this.editQuizDetails(this.quizDetails);
        }
        if (this.courseId) {
            //'5c0f73143100002c0924ec31'
            // this.editQuizDetails();
        }
        else {
            this.weightage = 100;
        }
    }

    optionValueUpdate(event, i) {
        this.optionData = !this.optionData;
        this.quizQuestionsForm[i].answer = parseInt(event.target.value) === 0 ? 'false' : 'true';
    }


    editQuizDetails(quizData) {
        // this.http.get(this.apiUrls.getQuiz).subscribe((resp) => {
        // this.videoDetails = resp.QuizDetails;
        // let slectedQuizDetails = resp.QuizDetails.find(x => x.CourseId === this.courseId);
        // let selectedVideoList = slectedQuizDetails && slectedQuizDetails.Videos && slectedQuizDetails.Videos[0];
        let selectedVideoList = quizData;
        this.selectedVideo = this.videoId;
        this.selectedCourse = this.courseId;
        if(selectedVideoList && selectedVideoList.length) {
            this.quizQuestionsForm =  selectedVideoList ;
            this.quizCreateType = '';
        } 
        else{
            this.quizCreateType = 'none';
            this.quizQuestionsForm  = [];
        } 
        //  [{
        //     // "questionId": 1,
        //     "questionName": "",
        //     "questionType": "MCQ",
        //     "options": [
        //         { "optionId": 1, "optionName": "" },
        //         { "optionId": 2, "optionName": "" },
        //         { "optionId": 3, "optionName": "" },
        //         { "optionId": 4, "optionName": "" }
        //     ],
        //     "weightage": '100',
        //     "answer": ''
        // }];
        this.weightage = selectedVideoList && selectedVideoList ? (100 / selectedVideoList.length).toFixed(2) : 100;
        // });
    }
    // Select options toggle
    questionTypeUpdate(data, i) {
        let quiz = this.quizQuestionsForm;
        quiz[i].QuestionType = data;
        if (data === "MCQ") {
            quiz[i].option = '';
            quiz[i].answer = '';
            quiz[i].options = [
                { "optionId": 1, "OptionName": "" },
                { "optionId": 2, "OptionName": "" },
                { "optionId": 3, "OptionName": "" },
                { "optionId": 4, "OptionName": "" }
            ];
            if (this.courseId) {
                quiz[i].trainingClassId = this.courseId;
            }
        }
        else if (data === "True/False") {
            quiz[i].options = [];
            quiz[i].option = "True/False";
            quiz[i].answer = 'true';
            if (this.courseId) {
                quiz[i].trainingClassId = this.courseId;
            }
        }
        else {
            quiz[i].options = [];
            quiz[i].option = '';
            quiz[i].answer = '';
            if (this.courseId) {
                quiz[i].trainingClassId = this.courseId;
            }
        }
    }

    // Add Question Box
    addQuestionForm() {
        let obj;
        if (this.courseId) {
            obj = {
                "questionName": "",
                "questionType": "MCQ",
                "options": [
                    { "optionId": 1, "optionName": "" },
                    { "optionId": 2, "optionName": "" },
                    { "optionId": 3, "optionName": "" },
                    { "optionId": 4, "optionName": "" }
                ],
                "weightage": '100',
                "answer": '',
                "trainingClassId": this.courseId
            };
        }
        else {
            obj = {
                "questionName": "",
                "questionType": "MCQ",
                "options": [
                    { "optionId": 1, "optionName": "" },
                    { "optionId": 2, "optionName": "" },
                    { "optionId": 3, "optionName": "" },
                    { "optionId": 4, "optionName": "" }
                ],
                "weightage": '100',
                "answer": ''
            };
        }
        // obj.trainingClassId = this.courseId;
        this.quizQuestionsForm.push(obj);
        obj.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
        this.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    }

    // Remove Question Box
    removeQuestionForm(index, data) {
        if (this.quizQuestionsForm.length > 1) {
            this.quizQuestionsForm.splice(index, 1);
            this.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
            if (this.courseId && data.questionId) {
                this.removedQuizIds.push(data.questionId)
            }
        }
        else {
            this.alertService.warn(this.commonLabels.mandatoryLabels.minimumQuiz);
        }
    }

    valueChanged(resp, submitCheck, update) {
        this.courseUpdate = true;
        let data = {
            courseUpdate: submitCheck,
            type: update ? true : false,
            resp: resp,
        }
        if(this.ownerShipErr){
          data['changeTC'] = true;
         this.valueChange.emit(data);
        }else{
         this.valueChange.emit(data);
        }
    }

    // Quiz Submission
    quizSubmit(submitType) {
        //Weightage update
        this.answerEmpty = false;
        this.optionEmpty = false;
        if (this.questionList) {
            // console.log(this.questionList);
            this.questionList.map((item,i) => {
                delete item.questionId;
                this.quizQuestionsForm.push(item);
            })
        }
        let data = this.quizQuestionsForm.map((item,i) => {
            // console.log(item)
            if(item.questionType !=  "True/False" && !item.answer){
              this.answerEmpty = true;
            }
            if(item.questionType == 'MCQ'){
              item.options.forEach(data=>{
                if(!data.optionName){
                  this.optionEmpty = true;
                }
              })
            }
            item.order = i+1;
            item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
            return item;
        })

        // console.log(this.quizQuestionsForm, "quiz Questions");
        let user = this.utilService.getUserData();
        let params;
        let hideTraining = submitType === 'yes' ? true : false;
        if(!this.optionEmpty && !this.answerEmpty || (this.quizCreateType === 'none')){
            if (this.selectCourseName && this.permissionService.nameValidationCheck(this.selectCourseName) && this.videoList.length && (this.quizQuestionsForm.length || this.quizCreateType === 'none')) {
                let data = this.quizQuestionsForm.length ? this.quizQuestionsForm.map(item => {
                    item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
                    return item;
                }) : [];
                //final data for submission
                if (this.courseId) {
                    params = {
                        "trainingClass": { "trainingClassName": this.selectCourseName },
                        "files": [],
                        "quizQuestions": data,
                        "quizName": this.quizName,
                        "trainingClassId": this.courseId,
                        "questionIds": this.removedQuizIds,
                        "fileIds": this.removedFileIds,
                        "quizId" : '',
                        "createdBy" : user.userId,
                        "resortId": this.resortId,
                        "quiz" : {
                            "quizId" : this.editQuizId,
                            "quizName": this.quizName,
                        },
                        "noQuiz" : 1
                    }
                    if(this.quizCreateType === 'none'){
                        delete params.quiz;
                        delete params.questionIds;
                        delete params.quizQuestions;
                        delete params.quizName;
                    }
                    else if(this.quizCreateType === 'new'){
                        delete params.quiz;
                        delete params.noQuiz;
                    }
                    else{
                        delete params.noQuiz;
                    }
                    if(this.quizCreateType == 'exist' && this.selectedQuiz){
                        let selectRes = this.selectedQuiz;
                        let quizId = selectRes.split('~');
                        // let query = '?quizId='+quizId[0]+'&trainingClassId='+quizId[1];
                        params.quizId = quizId[0];
                        delete params.quiz;
                        delete params.questionIds;
                        delete params.quizQuestions;
                      }
                      else{
                          delete params.quizId;
                      }
                }
                else {
                    params = {
                        "trainingClassName": this.selectCourseName,
                        "files": [],
                        "quizName": this.quizName,
                        "quizQuestions": data,
                        "quizId" : '',
                        "createdBy" : user.userId,
                        "resortId": this.resortId,
                        "draft" : false
                    }
                    if(this.quizCreateType === 'none'){
                        delete params.quizName;
                        delete params.quizQuestions;
                    }
                }

                if(this.roleId == 4){
                    params.draft = true
                }
                else{
                    delete params.draft;
                }
                if(this.quizCreateType == 'exist' && this.selectedQuiz){
                    let selectRes = this.selectedQuiz;
                    let quizId = selectRes.split('~');
                    // let query = '?quizId='+quizId[0]+'&trainingClassId='+quizId[1];
                    params.quizId = quizId[0];
                    delete params.quizName;
                    delete params.quizQuestions;
                }
                else{
                    delete params.quizId;
                }
                if (this.videoList.length) {
                    params.files = this.videoList.map(item => {
                        if (this.courseId) {
                            let obj = {
                                fileName: item.fileName,
                                fileDescription: item.fileDescription,
                                fileType: item.fileType,
                                fileUrl: item.fileUrl,
                                fileExtension: item.fileExtension,
                                fileImage: item.fileImage,
                                fileSize: item.fileSize,
                                fileLength: item.fileLength,
                                fileId: item.fileId,
                                trainingClassId: item.trainingClassId
                            }
                            return obj;
                        }
                        else {
                            let obj = {
                                fileName: item.fileName,
                                fileDescription: item.fileDescription,
                                fileType: item.fileType,
                                fileUrl: item.fileUrl,
                                fileExtension: item.fileExtension,
                                fileImage: item.fileImage,
                                fileSize: item.fileSize,
                                fileId: item.fileId,
                                fileLength: item.fileLength
                            }
                            return obj;
                        }



                    })
                }
                if (this.courseId) {
                    this.courseService.updateTrainingClass(this.courseId, params).subscribe((result) => {
                        if (result && result.isSuccess) {
                            this.removedQuizIds = [];
                            this.selectedQuiz = null;
                            this.ownerShipErr = false;
                            this.valueChanged(result.data, hideTraining, false);
                        }
                        this.modalRef && this.modalRef.hide();
                    },err=>{
                        let errData = err.error.error
                        this.ownerShipErr =errData && errData.statusKey ? true : false;
                        if(errData && errData.statusKey){
                            this.modalRef && this.modalRef.hide();
                            this.openTcModal(this.modalTemplate);
                        }
                    })
                }
                else{
                    params.quizQuestions && params.quizQuestions.length && params.quizQuestions.forEach(item=>{
                        if(item.questionId){
                            delete item.questionId;
                        }
                    })
                    this.courseService.addTrainingClass(params).subscribe((result) => {
                        if (result && result.isSuccess) {
                            this.selectedQuiz = null;
                            this.valueChanged(result.data, hideTraining, false);
                        }
                        this.modalRef.hide();

                    })
                }
            }
            else if (!this.selectCourseName && this.tabName == 'course') {
                this.modalRef.hide();
                //this.toastr.error("Course name is mandatory");
                this.alertService.error(this.commonLabels.mandatoryLabels.courseNameError);
                // this.courseId ? 
                //   this.valueChanged('',hideTraining,true)
                //   :
                //   this.valueChanged('',hideTraining,false);
                // this.redirectCourseList();
            }
            else if (!this.videoList.length) {
                this.modalRef.hide();
                this.alertService.error(this.commonLabels.mandatoryLabels.videoError);
            }
        }
        else if(this.answerEmpty){
            this.modalRef.hide();
            this.alertService.error(this.commonLabels.mandatoryLabels.quizAnswer);
        }
        else if(this.optionEmpty){
            this.modalRef.hide();
        this.alertService.error(this.commonLabels.mandatoryLabels.quizOption);
        }

    }

    
   //Open modal when trying to edit TC that was owned by another user.
    openTcModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    
   //Change TC name when trying to edit TC that was owned by another user.
    changeClassName(){
        if(this.updatedClassName){
            this.tcErr = false;
            this.courseId = "";
            this.selectCourseName= this.updatedClassName;
            this.quizSubmit('yes');
        }else{
            this.tcErr = true;
        }
    }


    //Remove selected quiz from form
    removeQuiz(data, i) {
        this.questionList.splice(i, 1);
    }


    openEditModal(template: TemplateRef<any>, modelValue) {
        if (this.moduleName) {
            let modalConfig = {
                class: "modal-dialog-centered"
            }
            this.modalRef = this.modalService.show(template, modalConfig);
        } else if (this.tabName == 'course') {
            this.alertService.error(this.commonLabels.labels.pleaseaddCourse);
        } else {
            this.addTrainingClass();
        }

    }

    openConfirmPopup(template: TemplateRef<any>) {
        let modalConfig = {
            class: "modal-dialog-centered"
        }
        this.modalRef = this.modalService.show(template, modalConfig);
    }

    uploadQuiz() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.tab == 'class') {
                this.route.navigate(['/uploadQuiz'], { queryParams: { tab: 'class' } });
            } else if (params.tab == 'course') {
                this.route.navigate(['/uploadQuiz'], { queryParams: { tab: 'course' } });
            }
        })
    }

    addTrainingClass() {
        let params;
        this.answerEmpty = false;
        this.optionEmpty = false;
        if (this.quizName || this.selectedQuiz || this.quizCreateType === 'none') {
            if (this.selectCourseName && this.permissionService.nameValidationCheck(this.selectCourseName) &&this.videoList.length && (this.quizQuestionsForm.length || this.quizCreateType === 'none')) {
                if (this.questionList) {
                    this.questionList.map(item => {
                        delete item.questionId;
                        this.quizQuestionsForm.push(item);
                    })
                }
                let data = this.quizQuestionsForm.map((item,i) => {
                    // console.log(item)
                    if(item.questionType !=  "True/False" && !item.answer){
                      this.answerEmpty = true;
                    }
                    if(item.questionType == 'MCQ'){
                      item.options.forEach(data=>{
                        if(!data.optionName){
                          this.optionEmpty = true;
                        }
                      })
                    }
                    item.order = i+1;
                    item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
                    return item;
                })
                let user = this.utilService.getUserData();
                //final data for submission
                if(this.classId){
                    params = {
                        "trainingClassName": this.selectCourseName,
                        "files": [],
                        "createdBy" : user.userId,
                        "quizName": this.quizName,
                        "quiz" : {},
                        "trainingClassId": this.classId,
                        "questionIds": this.removedQuizIds,
                        "quizQuestions": data,
                        "resortId":this.resortId,
                        "noQuiz" : 1
                    }
                    if(this.quizCreateType === 'none'){
                        delete params.quiz;
                        delete params.questionIds;
                        delete params.quizQuestions;
                    }
                    else{
                        delete params.noQuiz;
                    }
                    if(this.quizCreateType == 'exist' && this.selectedQuiz){
                        delete params.quiz;
                        delete params.questionIds;
                        delete params.quizQuestions;
                        let selectRes = this.selectedQuiz;
                        let quizId = selectRes.split('~');
                        // let query = '?quizId='+quizId[0]+'&trainingClassId='+quizId[1];
                        params.quizId = quizId[0]; 
                      }
                      else{
                          delete params.quizId;
                      }
                }
                else{
                    params = {
                        "trainingClassName": this.selectCourseName,
                        "files": [],
                        "quizName": this.quizName,
                        "quizQuestions": data,
                        "quizId" : '',
                        "createdBy" : user.userId,
                        "resortId":this.resortId,
                        "draft" : false
                    }
                    if(this.quizCreateType === 'none'){
                        delete params.quizName;
                        delete params.quizQuestions;
                    }
                }
                if(this.roleId == 4){
                    params.draft = true
                  }
                  else{
                    delete params.draft;
                  }

                if(this.quizCreateType == 'exist' && this.selectedQuiz){
                    let selectRes = this.selectedQuiz;
                    let quizId = selectRes.split('~');
                    // let query = '?quizId='+quizId[0]+'&trainingClassId='+quizId[1];
                    params.quizId = quizId[0];
                    delete params.quizName;
                    delete params.quizQuestions;
                  }
                  else{
                      delete params.quizId;
                  }
                if (this.videoList.length) {
                    params.files = this.videoList.map(item => {
                        if (this.classId) {
                            let obj = {
                                fileName: item.fileName,
                                fileDescription: item.fileDescription,
                                fileType: item.fileType,
                                fileUrl: item.fileUrl,
                                fileExtension: item.fileExtension,
                                fileImage: item.fileImage,
                                fileSize: item.fileSize,
                                fileLength: item.fileLength,
                                fileId: item.fileId,
                                trainingClassId: item.trainingClassId
                            }
                            return obj;
                        }
                        else {
                            let obj = {
                                fileName: item.fileName,
                                fileDescription: item.fileDescription,
                                fileType: item.fileType,
                                fileUrl: item.fileUrl,
                                fileExtension: item.fileExtension,
                                fileImage: item.fileImage,
                                fileSize: item.fileSize,
                                fileLength: item.fileLength,
                                fileId: item.fileId
                            }
                            return obj;
                        }
                    }
                    )
                }

                if((!this.optionEmpty && !this.answerEmpty) || (this.quizCreateType === 'none')){
                    if(this.classId){
                        if(this.quizCreateType !== 'none' && this.quizCreateType !== 'exist'){
                            params.quiz = {
                                "quizId" : '',
                                "quizName": this.quizName
                            }
                            this.editQuizId ? params.quiz.quizId = this.editQuizId : delete params.quiz.quizId;
                        }
                        if(this.quizCreateType === 'new'){
                            delete params.quiz;
                            delete params.noQuiz;
                        }
                        // console.log(params)
                        this.courseService.updateTrainingClass(this.classId,params).subscribe((result) => {
                            // console.log(result)
                            if(result && result.isSuccess){
                                this.selectedQuiz = null;
                                this.classId = '';
                                // this.route.navigate(['/cmspage'], { queryParams: { type: 'edit' } })
                                this.route.navigate(['/cms-library'], { queryParams: { type: 'edit', tab: 'class' } })
                                this.completed.emit(true);
                                this.alertService.success(result.message);
                                this.fileService.emptyFileList();
                                this.quizService.setQuiz('');
                            }
                        })
                        
                    }
                    else{
                        this.courseService.addTrainingClass(params).subscribe((result) => {
                            if (result && result.isSuccess) {
                                this.selectedQuiz = null;
                                this.route.navigate(['/cmspage'], { queryParams: { type: 'create' } })
                                this.completed.emit(true);
                                this.alertService.success(result.message);
                                this.fileService.emptyFileList();
                                this.quizService.setQuiz('');
                            }
                        })
                    }
                }
                else if(this.answerEmpty ){
                    this.alertService.error(this.commonLabels.mandatoryLabels.quizAnswer);
                }
                else if(this.optionEmpty){
                this.alertService.error(this.commonLabels.mandatoryLabels.quizOption);
                }
            } else {
                this.alertService.error('Please fill mandatory fields in Files tab');
            }
        } else {
            this.alertService.error('Quiz Name is required');
        }
    }

  getquizList(){
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let query = roleId !=1 ? '?createdBy='+user.userId : '';
    this.courseService.getQuizList(query).subscribe(res=>{
        if(res.isSuccess){
            this.quizList = res.data && res.data.quiz;
        }
    })
}

getQuizData(){
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let selectRes = this.selectedQuiz;
    // let quizId = selectRes.split('~');
    // let query = '?quizId='+quizId[0]+'&trainingClassId='+quizId[1];
    let query = '?quizId='+selectRes;
    this.enableAddQuiz = true;
    this.courseService.getQuizList(query).subscribe(res=>{
        if(res.isSuccess){
            // console.log(res)
            let quizList = res.data && res.data.quiz;
            this.quizQuestionsForm = quizList.length && quizList[0].Questions && quizList[0].Questions.length ? quizList[0].Questions : [];
            // console.log(this.quizQuestionsForm)
        }
    })
}

  quizTypeUpdate(event,i){
    this.quizCreateType = event.target.value;
    if(this.quizCreateType == 'exist'){
        this.getquizList();
    }
   else if(this.quizCreateType == "none"){
    this.quizQuestionsForm = []; 
   }
    else{
        this.quizQuestionsForm = [{
            // "questionId": 1,
            "questionName": "",
            "questionType": "MCQ",
            "options": [
                { "optionId": 1, "optionName": "" },
                { "optionId": 2, "optionName": "" },
                { "optionId": 3, "optionName": "" },
                { "optionId": 4, "optionName": "" }
            ],
            "weightage": '100',
            "answer": ''
        }];
    }
    if(!event.target.checked && this.enableQuiz) {
        this.editQuizDetails(this.quizDetails);
    }
    if(this.quizCreateType == 'new' || (this.quizCreateType == 'exist' && this.selectedQuiz)){
        if(this.quizCreateType == 'new'){
            this.enableAddQuiz = true;
            this.selectedQuiz = null;
        }
        else if(this.selectedQuiz){
            this.getQuizData();
        }
    }
    else{
        this.enableAddQuiz = false;
    }
  }

  mcqAnswerUpdate(answer,index){
    // console.log(answer,index)
    if(answer){
        this.quizQuestionsForm[index].answer = answer;
    }
    else{
        this.alertService.error(this.commonLabels.mandatoryLabels.optionSelect)
    }
    
  }

  duplicateOptionCheck(index,value,optionIndex){
    let data = this.quizQuestionsForm[index].options;
    data.length && data.forEach((item,i)=>{
        if(i != optionIndex){
            if(item.optionName && value == item.optionName){
                this.alertService.warn(this.commonLabels.mandatoryLabels.optionDuplicate)
                this.quizQuestionsForm[index].options[optionIndex].optionName = '';
            }
        }
    })
  }

}
