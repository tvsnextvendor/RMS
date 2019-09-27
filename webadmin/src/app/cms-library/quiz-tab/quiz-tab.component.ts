import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HeaderService, HttpService, AlertService, BreadCrumbService ,UtilService,PermissionService} from '../../services';
import { QuizVar } from '../../Constants/quiz.var';
import { CommonLabels } from '../../Constants/common-labels.var';
import { CourseService } from '../../services/restservices/course.service';
// import { API_URL } from '../../Constants/api_url';

@Component({
  selector: 'app-quiz-tab',
  templateUrl: './quiz-tab.component.html',
  styleUrls: ['./quiz-tab.component.css']
})
export class QuizTabComponent implements OnInit {
  @Input() trainingClassId;
  @Input() courseId;
  @Input() uploadPage;
  @Input() directTabEnable;
  @Input() disableEdit;
  @Input() CMSFilterSearchEventSet;
  questionForm;
  weightage;
  questionOptions = [];
  courseOptions = [];
  videoOptions = [];
  optionType = false;
  courseName;
  trainingClassName;
  quizQuestionsForm = [];
  title;
  apiUrls;
  hidemodule = false;
  optionData = true;
  modalRef;
  modalConfig;
  quizName;
  deleteQueId;
  courseList;
  trainingClassList;
  filterCourse = null;
  filterTrainingClass = null;
  enableQuizEdit = false;
  quizList = [];
  pageLength;
  currentPage;
  totalQuizCount;
  resourceLib = false;
  iconEnable = true;
  editIconHide = false;
  roleId;
  selectedQuiz;
  userData;
  accessSet = false;
  quizId;
  iconEnableApproval = false;

  constructor(private courseService: CourseService, private headerService: HeaderService, private alertService: AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public commonLabels: CommonLabels, public constant: QuizVar, private toastr: ToastrService, private modalService: BsModalService, private breadCrumbService: BreadCrumbService,private utilService:UtilService,private permissionService : PermissionService) { }

  ngOnInit() {
    this.pageLength=10;
    this.currentPage = 1;
    this.roleId = this.utilService.getRole(); 
    this.userData = this.utilService.getUserData();
    this.accessSet = this.utilService.getUserData() && this.utilService.getUserData().accessSet && this.utilService.getUserData().accessSet == 'ApprovalAccess' ? true : false;
    this.questionOptions = [
      { name: "MCQ", value: "MCQ" },
      { name: "True/False", value: "True/False" },
      { name: "Non-MCQ", value: "NON-MCQ" }
    ];
    this.quizQuestionsForm = [];
    if(window.location.pathname.indexOf("resource") != -1){
      let data = [{title : this.commonLabels.labels.resourceLibrary,url:'/resource/library'},{title : this.commonLabels.labels.quiz,url:''}];
      this.breadCrumbService.setTitle(data);
      this.resourceLib = true;
    }else{
      let data = [{ title: this.commonLabels.labels.edit, url: '/cms-library' }, { title: this.commonLabels.labels.quiz, url: '' }]
      this.breadCrumbService.setTitle(data);
      this.enableQuizEdit = true;
    }
    if(this.roleId == 4 && this.resourceLib || !this.permissionService.editPermissionCheck('Course / Training Class / Quiz')){
      this.iconEnable = false;
    }
    if((this.roleId == 4 && !this.resourceLib)){
      this.iconEnableApproval = true;
    }
    if(this.enableQuizEdit){
      this.getquizList();
    }
    else{
      if (this.directTabEnable) {
        this.getDropDownDetails();
      }
      else {
        this.editQuizDetails();
      }
    }
    this.weightage = 100;
  }

  ngDoCheck() {
    if (this.CMSFilterSearchEventSet !== undefined && this.CMSFilterSearchEventSet !== '') {
      if(this.enableQuizEdit){
        this.currentPage = 1;
        this.getquizList();
      }
    } 
  } 

  getquizList(){
    let user = this.utilService.getUserData();
    let roleId = this.utilService.getRole();
    let resortId = user.ResortUserMappings && user.ResortUserMappings.length && user.ResortUserMappings[0].Resort.resortId;
    let query = this.courseService.searchQuery(this.CMSFilterSearchEventSet) ? 
                  (roleId !=1 ?  '?page='+this.currentPage+'&size='+this.pageLength+this.courseService.searchQuery(this.CMSFilterSearchEventSet)+'&resortId='+resortId  : '?page='+this.currentPage+'&size='+this.pageLength+this.courseService.searchQuery(this.CMSFilterSearchEventSet)) : 
                    (roleId !=1 ? '?createdBy='+user.userId+'&resortId='+resortId : '');
    if(roleId == 4 ){
      let accessSet = this.utilService.getUserData() && this.utilService.getUserData().accessSet == 'ApprovalAccess' ? true : false;
      query = this.resourceLib ? (query+"&draft=false") : (accessSet ? query+"&draft=true" : query);
      // query = this.resourceLib ? (query+"&draft=false") : (query+"&draft=true");
    }
    this.courseService.getQuizList(query).subscribe(res=>{
      this.CMSFilterSearchEventSet = '';
        if(res && res.isSuccess){
            this.quizList = res.data.quiz;
            this.totalQuizCount = this.quizList.length;
        }
      }, err => {
        this.CMSFilterSearchEventSet = '';
      });
}

pageChanged(e) {
  this.currentPage = e;
  this.getquizList();
}

  optionValueUpdate(data) {
    this.optionData = !this.optionData;
    data.answer = this.optionData;
  }

  getDropDownDetails() {
    // let user = this.utilService.getUserData() ? "?created="+this.utilService.getUserData().userId : '';
    // this.courseService.getAllCourse(user).subscribe(result => {
    //   if (result && result.isSuccess) {
    //     this.courseList = result.data && result.data.rows;
    //   }
    // })
    let user = this.utilService.getUserData();
    let resortId = user.ResortUserMappings.length ? user.ResortUserMappings[0].Resort.resortId : ''; 
    let query = resortId ? '?resortId='+resortId : ''; 
    this.courseService.getCourseForNotification(query).subscribe(result=>{
      if(result && result.isSuccess){
        this.courseList = result.data.length && result.data;
      }
    })
    let queryTC = resortId ? '?resortId='+resortId : ''; 
    this.courseService.getDropTrainingClassList(queryTC).subscribe(resp=>{
      if(resp && resp.isSuccess){
        this.trainingClassList = resp.data && resp.data.rows.length ? resp.data.rows : [];
      }
    })
  }
  dropdownUpdate(courseId) {
    this.filterTrainingClass = 'null';
    this.courseId = this.filterCourse;
    if(courseId && courseId != 'null'){
      this.courseService.getTrainingclassesById(courseId).subscribe(result => {
        if (result && result.isSuccess) {
          this.quizQuestionsForm = [];
          this.trainingClassList = result.data && result.data.length && result.data;
        }
      })
    }
    else{
      this.quizQuestionsForm = [];
      this.getDropDownDetails();
    }
    
  }
  dropdownClassUpdate() {
    this.trainingClassId = this.filterTrainingClass;
    this.editQuizDetails();
  }

  editQuizDetails() {
    let QuizList;
    let userData = this.utilService.getUserData().userId; 
    this.courseService.getTrainingClassQuiz(this.trainingClassId, this.courseId).subscribe((resp) => {
      if (resp && resp.isSuccess) {
        let responseQuiz = resp.data.quiz;
        let responseCourse = resp.data.course;
        this.courseName = responseCourse && responseCourse.courseName;
        this.trainingClassName = responseQuiz && responseQuiz.length && responseQuiz[0].QuizMappings[0].TrainingClass && responseQuiz[0].QuizMappings[0].TrainingClass.trainingClassName;
        let responseList = responseQuiz && responseQuiz.length && responseQuiz[0].Questions;
        this.quizName= responseQuiz  && responseQuiz.length && responseQuiz[0].quizName;
        this.quizId= responseQuiz  && responseQuiz.length && responseQuiz[0].quizId;
        let created = responseQuiz  && responseQuiz.length ? responseQuiz[0].createdBy : '';
        if(created && userData == created){
          this.editIconHide = true;
        }
        QuizList = responseList && responseList.map(item => {
          item.enableEdit = false;
          return item;
        })
        this.quizQuestionsForm = QuizList && QuizList.length ? QuizList : [];
        this.weightage = QuizList && QuizList ? (100 / QuizList.length).toFixed(2) : 100;
      }
    });
  }
  // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    quiz[i].QuestionType = data;
    if (data === "MCQ") {
      quiz[i].option = '';
      quiz[i].options = [
        { "optionId": 1, "OptionName": "" },
        { "optionId": 2, "OptionName": "" },
        { "optionId": 3, "OptionName": "" },
        { "optionId": 4, "OptionName": "" },
        { "optionId": 5, "OptionName": "" },
        { "optionId": 6, "OptionName": "" }

      ];
      quiz[i].answer = '';
    }
    else if (data === "True/False") {
      quiz[i].options = [];
      quiz[i].option = "True/False";
      quiz[i].answer = '';
    }
    else {
      quiz[i].options = [];
      quiz[i].option = '';
      quiz[i].answer = '';
    }
  }


  courseChange() {
    // // this.selectedCourse = 1;
    // console.log(this.selectedCourse);
  }

  // Add Question Box
  addQuestionForm() {
    let obj = {
      // "questionId": 1,
      "questionName": "",
      "questionType": "MCQ",
      "options": [
        { "optionId": 1, "optionName": "" },
        { "optionId": 2, "optionName": "" },
        { "optionId": 3, "optionName": "" },
        { "optionId": 4, "optionName": "" },
        { "optionId": 5, "OptionName": "" },
        { "optionId": 6, "OptionName": "" }
      ],
      "weightage": '100',
      "answer": ''
    };
    // obj.questionId = this.quizQuestionsForm.length + 1;
    this.quizQuestionsForm.push(obj);
    obj.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    this.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
  }

  // Remove Question Box
  removeQuestionForm(index) {
    if (this.quizQuestionsForm.length > 1) {
      this.quizQuestionsForm.splice(index, 1);
      this.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    }
    else {
      this.alertService.warn(this.commonLabels.mandatoryLabels.minimumQuiz);
    }
  }

  valueChanged(update) {
    // this.courseUpdate = true;
    let data = {
      courseUpdate: true,
      type: update ? true : false
    }
    // this.valueChange.emit(data);
  }

  redirectCourseList() {
    this.route.navigateByUrl('/cms-library');
  }

  editQuizEnable(i) {
    this.quizQuestionsForm[i].enableEdit = true;
  }

  cancelQuizSubmit(i) {
    this.quizQuestionsForm[i].enableEdit = false;
    this.editQuizDetails();
  }

  quizSubmit(data, i) {
    let params = {
      "quizId":this.quizId,
      "quizName": this.quizName,
      "questionName": data.questionName,
      "questionType": data.questionType,
      "weightage": data.weightage,
      "options": data.options,
      "answer": data.answer,
      "trainingClassId": data.trainingClassId
    }
    this.courseService.updateQuestion(data.questionId, params).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.alertService.success(resp.message);
        this.cancelQuizSubmit(i);
      }
    })
  }
  removeQuiz(template: TemplateRef<any>, data) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.deleteQueId = data.questionId;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  deleteQuizQuestion() {
    this.courseService.deleteQuizList(this.deleteQueId).subscribe(resp => {
      if (resp && resp.isSuccess) {
        this.modalRef.hide();
        this.alertService.success(resp.message);
        this.editQuizDetails();
      }
    })
  }

  editQuizData(data,i){
    this.route.navigate(['/createQuiz'],{queryParams:{quizId:data.quizId}})
  }

  approvalConfirmation(template: TemplateRef<any>, quiz) {
    let modalConfig = {
      class: "modal-dialog-centered"
    }
    this.selectedQuiz = quiz;
    this.modalRef = this.modalService.show(template, modalConfig);
  }
  sendApproval() {
    let userData = this.utilService.getUserData();
    let userId = userData.userId;
    let resortId = userData.ResortUserMappings[0].Resort.resortId
    let approvalData = {
      'contentName': this.selectedQuiz.quizName,
      'contentId': this.selectedQuiz.quizId,
      'contentType': 'Quiz',
      'resortId': resortId,
      'createdBy': userId,
      'reportingTo': userData.reportingTo
    };
    this.courseService.sendApproval(approvalData).subscribe(result => {
      this.modalRef.hide();
      if (result && result.isSuccess) {
        // this.alertService.success(result.message);
        setTimeout(()=>{
          this.alertService.success(result.message);
        },300) 
      } else {
        // this.alertService.error(result.message);
        setTimeout(()=>{
          this.alertService.error(result.message);
        },300) 
      }
    }, (errorRes) => {
      this.modalRef.hide();
      setTimeout(()=>{
        this.alertService.error(errorRes.error.error);
      },300) 
      
    });
  }
}
