import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService,UtilService } from '../../services';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { CourseService } from '../../services/restservices/course.service';
import { API_URL } from '../../Constants/api_url';
import { AlertService, FileService } from '../../services';
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


    constructor(private modalService: BsModalService, private fileService: FileService, private quizService: QuizService, private courseService: CourseService, private headerService: HeaderService, private alertService: AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public constant: QuizVar, private toastr: ToastrService,
        public commonLabels: CommonLabels,private utilService : UtilService) {
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
        this.quizQuestionsForm = selectedVideoList && selectedVideoList.length ? selectedVideoList : [{
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
            // submitCheck : submitCheck
        }
        this.valueChange.emit(data);
    }

    // Quiz Submission
    quizSubmit(submitType) {
        //Weightage update
        if (this.questionList) {
            console.log(this.questionList);
            this.questionList.map(item => {
                delete item.questionId;
                this.quizQuestionsForm.push(item);
            })
        }

        console.log(this.quizQuestionsForm, "quiz Questions");
        let user = this.utilService.getUserData();
        let params;
        let hideTraining = submitType === 'yes' ? true : false;
        if (this.selectCourseName && this.videoList.length && this.quizQuestionsForm.length) {
            let data = this.quizQuestionsForm.map(item => {
                item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
                return item;
            })
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
                    "resortId": this.resortId
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
                    "resortId": this.resortId
                }
            }

            if(this.quizCreateType == 'exist' && this.selectedQuiz){
                params.quizId = this.selectedQuiz;
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
                        this.valueChanged(result.data, hideTraining, false);
                    }
                    this.modalRef && this.modalRef.hide();
                })
            }
            else {
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
        if (this.quizName || this.selectedQuiz) {
            if (this.selectCourseName && this.videoList.length && this.quizQuestionsForm.length) {
                if (this.questionList) {
                    this.questionList.map(item => {
                        delete item.questionId;
                        this.quizQuestionsForm.push(item);
                    })
                }
                let data = this.quizQuestionsForm.map(item => {
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
                        "quiz" : {},
                        "trainingClassId": this.classId,
                        "questionIds": this.removedQuizIds,
                        "quizQuestions": data,
                        "resortId":this.resortId
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
                        "resortId":this.resortId
                    }
                }

                if(this.quizCreateType == 'exist' && this.selectedQuiz){
                    params.quizId = this.selectedQuiz;
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
                                fileLength: item.fileLength
                            }
                            return obj;
                        }
                    }
                    )
                }
                if(this.classId){
                    params.quiz = {
                        "quizId" : this.editQuizId,
                        "quizName": this.quizName
                    }
                    console.log(params)
                    this.courseService.updateTrainingClass(this.classId,params).subscribe((result) => {
                        console.log(result)
                        if(result && result.isSuccess){
                            this.selectedQuiz = null;
                            this.classId = '';
                            this.route.navigate(['/cmspage'], { queryParams: { type: 'edit' } })
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
            } else {
                this.alertService.error('Please fill mandatory fields in Files tab');
            }
        } else {
            this.alertService.error('Quiz Name is required');
        }
    }

  getquizList(){
    let user = this.utilService.getUserData();
    this.courseService.getQuizList(user.userId).subscribe(res=>{
        if(res.isSuccess){
            this.quizList = res.data && res.data.quiz;
        }
    })
}


  quizTypeUpdate(event,i){
    this.quizCreateType = event.target.value;
    if(this.quizCreateType == 'exist'){
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
    this.getquizList();
    }
  }
}
