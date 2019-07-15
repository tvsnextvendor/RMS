import { Component, OnInit ,Input,Output,EventEmitter,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeaderService,BreadCrumbService,UtilService} from '../../services';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { CourseService } from '../../services/restservices/course.service';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonLabels } from '../../Constants/common-labels.var'

@Component({
  selector: 'create-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']

})
export class CreateQuizComponent implements OnInit {
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
  title;
  apiUrls;
  hidemodule = false;
  optionData = true;
  modalRef;
  removedQuizIds = [];
  quizName;
  borderUpdate = false;
  quizId;
  userData;
  resortId;
  answerEmpty = false;
  optionEmpty = false;
  roleId;

  constructor(private modalService: BsModalService,private courseService:CourseService,private headerService: HeaderService,private alertService:AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public constant: QuizVar,private toastr: ToastrService,
    public commonLabels:CommonLabels,public location : Location,private breadCrumbService : BreadCrumbService,private utilService :UtilService) {
    this.apiUrls = API_URL.URLS;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.quizId = params.quizId ? params.quizId : '';
  });
  this.userData = this.utilService.getUserData();
  this.resortId = this.userData.ResortUserMappings.length && this.userData.ResortUserMappings[0].Resort.resortId;
  }
  
  ngOnInit() {
    this.quizId ? this.headerService.setTitle({title:this.commonLabels.labels.edit, hidemodule:false}) : this.headerService.setTitle({title:this.commonLabels.labels.create, hidemodule:false});
    this.roleId = this.utilService.getRole();
    let data = this.quizId ? [{title : this.commonLabels.labels.edit,url:'/cms-library'},{title : this.commonLabels.btns.editQuiz,url:''}] : [{title : this.commonLabels.btns.create,url:'/cmspage'},{title : this.commonLabels.labels.createQuiz,url:''}]
    this.breadCrumbService.setTitle(data)
    this.questionOptions = [
      { name: "MCQ", value: "MCQ" },
      { name: "True/False", value: "True/False" },
      { name: "Non-MCQ", value: "NON-MCQ" }
    ];
    this.quizQuestionsForm = [{
      "questionName": "",
      "questionType": "MCQ",
      "options": [
        { "optionId": 1, "optionName": "" },
        { "optionId": 2, "optionName": "" },
        { "optionId": 3, "optionName": "" },
        { "optionId": 4, "optionName": "" }
      ],
      "weightage": '100',
      "answer" : ''
    }];

    if(this.quizId){
      this.getQuizData();
    }
    // else {
      this.weightage = 100;
    // }
  }

  getQuizData(){
    let user = this.utilService.getUserData();
    let query = "&quizId="+this.quizId;
    this.courseService.getQuizListById(user.userId,query).subscribe(res=>{
        if(res && res.isSuccess){
            this.quizName = res.data.quiz.length && res.data.quiz[0].quizName;
            this.quizQuestionsForm = res.data.quiz.length && res.data.quiz[0].QuizMappings.length ? res.data.quiz[0].QuizMappings.map(item=>{return item.Question}) : [{
              "questionName": "",
              "questionType": "MCQ",
              "options": [
                { "optionId": 1, "optionName": "" },
                { "optionId": 2, "optionName": "" },
                { "optionId": 3, "optionName": "" },
                { "optionId": 4, "optionName": "" }
              ],
              "weightage": '100',
              "answer" : ''
            }];
        }
    })
  }

  optionValueUpdate(event,i){
    this.optionData = !this.optionData;
    this.quizQuestionsForm[i].answer = parseInt(event.target.value) === 0 ? 'false' : 'true';
  }
  
  editQuizDetails(quizData){
      this.quizQuestionsForm = [{
        "questionName": "",
        "questionType": "MCQ",
        "options": [
          { "optionId": 1, "optionName": "" },
          { "optionId": 2, "optionName": "" },
          { "optionId": 3, "optionName": "" },
          { "optionId": 4, "optionName": "" }
        ],
        "weightage": '100',
        "answer" : ''
      }];
      // this.weightage = selectedVideoList && selectedVideoList  ? (100 / selectedVideoList.length).toFixed(2) : 100;
    // });
  }
   // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    if (data === "MCQ") {
      quiz[i].option = '';
      quiz[i].answer = '';
      quiz[i].options = [
        { "optionId": 1, "OptionName": "" },
        { "optionId": 2, "OptionName": "" },
        { "optionId": 3, "OptionName": "" },
        { "optionId": 4, "OptionName": "" }
      ];
    }
    else if(data === "True/False"){
      delete quiz[i].options;
      quiz[i].answer = 'true';
    }
    else{
      delete quiz[i].options;
      quiz[i].answer = '';
    }
  }


  // Add Question Box
  addQuestionForm() {
    let obj;
    this.borderUpdate = true;
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
        "answer" : ''
      };
    // obj.trainingClassId = this.courseId;
    this.quizQuestionsForm.push(obj);
    obj.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
  }

  // Remove Question Box
  removeQuestionForm(index,data) {
    if(this.quizQuestionsForm.length>1){
      this.quizQuestionsForm.splice(index, 1);
      this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
      if(this.quizId){
        data.questionId ? this.removedQuizIds.push(data.questionId) : '';
      }
    }
    else{
      this.alertService.warn(this.commonLabels.mandatoryLabels.minimumQuiz);
    }
    this.quizQuestionsForm.length == 1 ? this.borderUpdate = false : this.borderUpdate = true;
  }

  valueChanged(resp,submitCheck,update){
    this.courseUpdate = true;
    let data = {
      courseUpdate : submitCheck,
    }
    // this.valueChange.emit(data);
  }

  // Quiz Submission
  quizSubmit(submitType) {
    //Weightage update   
    this.answerEmpty = false;
    this.optionEmpty = false;
      let data = this.quizQuestionsForm.map(item => {
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
          item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
          return item;
      })
    if(!this.answerEmpty && !this.optionEmpty)  
     if(this.quizId){
      let postData= {
        quizId : this.quizId,
        quizName : this.quizName,
        quizQuestions : this.quizQuestionsForm,
        questionIds : this.removedQuizIds
      }
      this.courseService.updateQuizList(this.quizId,postData).subscribe(resp=>{
        if(resp && resp.isSuccess){
          this.route.navigate(['/cms-library'],{queryParams : {type : 'edit',tab:'quiz'}});
          this.alertService.success(resp.message);
        }
      })
     }
     else{
      let postData= {
        quizName : this.quizName,
        quizQuestions : this.quizQuestionsForm,
        createdBy:this.userData.userId,
        resortId:this.resortId,
        draft : false
      }
      if(this.roleId == 4){
        postData.draft = true
      }
      else{
        delete postData.draft;
      }
      this.courseService.addQuiz(postData).subscribe(res=>{
        if(res.isSuccess){
          this.route.navigate(['/cmspage'],{queryParams : {type : 'create'}});
          this.alertService.success(res.message);
        } 
      })
    }
    else if(this.answerEmpty ){
      this.alertService.error(this.commonLabels.mandatoryLabels.quizAnswer);
    }
    else if(this.optionEmpty){
      this.alertService.error(this.commonLabels.mandatoryLabels.quizOption);
    }
  }

  goTocmsLibrary(data){
    if(data){
        this.route.navigate(['/cms-library'],{queryParams:{type : 'edit',tab : 'course'}})
    }
    else{
        this.location.back(); 
    }
}

mcqAnswerUpdate(answer,index){
  // console.log(answer,index)
  if(answer){
      this.quizQuestionsForm[index].answer = answer;
  }
  else{
      this.alertService.error("Please enter the option data before select answer")
  }
  
}

}
