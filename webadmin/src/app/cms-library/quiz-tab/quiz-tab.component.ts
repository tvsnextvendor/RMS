import { Component, OnInit,Input,TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HeaderService,HttpService,AlertService } from '../../services';
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
  deleteQueId;
  courseList;
  trainingClassList;
  filterCourse = null;
  filterTrainingClass = null;
  
  constructor(private courseService:CourseService,private headerService: HeaderService,private alertService:AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, private commonLabels : CommonLabels,public constant: QuizVar,private toastr: ToastrService,private modalService : BsModalService) {}
  
  ngOnInit() {
    this.questionOptions = [
      { name: "MCQ", value: "MCQ" },
      { name: "True/False", value: "True/False" },
      { name: "Non-MCQ", value: "NON-MCQ" }
    ];
    this.quizQuestionsForm = [];
    if(this.directTabEnable){
      this.getDropDownDetails();
    }
    else{
      this.editQuizDetails();
    }
    this.weightage = 100;
  }

  optionValueUpdate(data){
    this.optionData = !this.optionData;
    data.answer =  this.optionData;
  }

  getDropDownDetails(){
    this.courseService.getAllCourse().subscribe(result=>{
      if(result && result.isSuccess){
        this.courseList = result.data && result.data.rows;
      }
    })
  }
  dropdownUpdate(courseId){
    this.filterTrainingClass = 'null';
    this.courseId = courseId;
    this.courseService.getTrainingclassesById(courseId).subscribe(result=>{
      console.log(result);
      if(result && result.isSuccess){
        this.trainingClassList = result.data && result.data.length && result.data;
        console.log(result);
      }
    })
  }
  dropdownClassUpdate(){
    this.trainingClassId = this.filterTrainingClass;
    this.editQuizDetails();
  }

  editQuizDetails(){
    let QuizList ;
    this.courseService.getTrainingClassQuiz(this.trainingClassId,this.courseId).subscribe((resp)=>{
    // this.http.get('5cb1afec330000a81e5720af').subscribe((resp) => {
      console.log(resp)
      if(resp && resp.isSuccess){
        this.courseName = resp.data && resp.data.length &&  resp.data[0].courseName;
        this.trainingClassName = resp.data && resp.data.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.trainingClassName;
        let responseList =  resp.data && resp.data.length && resp.data[0].CourseTrainingClassMaps[0].TrainingClass.Questions;
        QuizList = responseList.map(item=>{
           item.enableEdit = false;
           return item;
        })
       
        this.quizQuestionsForm = QuizList && QuizList.length ? QuizList : [];
        this.weightage = QuizList && QuizList  ? (100 / QuizList.length).toFixed(2) : 100;
      }
    });
  }
   // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    quiz[i].QuestionType = data;
    if (data === "1") {
      quiz[i].option = '';
      quiz[i].options = [
        { "optionId": 1, "OptionName": "" },
        { "optionId": 2, "OptionName": "" },
        { "optionId": 3, "OptionName": "" },
        { "optionId": 4, "OptionName": "" }
      ];
      quiz[i].answer = '';
    }
    else if(data === "2"){
      quiz[i].options = [];
      quiz[i].option = "True/False";
      quiz[i].answer = '';
     }
    else{
      quiz[i].options = [];
      quiz[i].option = '';
      quiz[i].answer = '';
    }
  }


  courseChange(){
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
        { "optionId": 4, "optionName": "" }
      ],
      "weightage": '100',
      "answer" : ''
    };
    // obj.questionId = this.quizQuestionsForm.length + 1;
    this.quizQuestionsForm.push(obj);
    obj.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
  }

  // Remove Question Box
  removeQuestionForm(index) {
    if(this.quizQuestionsForm.length>1){
      this.quizQuestionsForm.splice(index, 1);
      this.weightage  = (100 / this.quizQuestionsForm.length).toFixed(2);
    }
    else{
      this.alertService.warn("Minimum one quiz is mandatory");
    }
  }

  valueChanged(update){
    // this.courseUpdate = true;
    let data = {
      courseUpdate : true,
      type : update ? true : false
    }
    // this.valueChange.emit(data);
  }

  redirectCourseList(){
    this.route.navigateByUrl('/cms-library');
  }

  editQuizEnable(i){
    this.quizQuestionsForm[i].enableEdit = true;
  }

  cancelQuizSubmit(i){
    this.quizQuestionsForm[i].enableEdit = false;
    this.editQuizDetails();
  }

  quizSubmit(data,i){
    console.log(data)
    let params = {
      "questionName" : data.questionName,
      "questionType" : data.questionType,
      "weightage" : data.weightage,
      "options" : data.options ,
      "answer": data.answer,
      "trainingClassId" : data.trainingClassId
    }
    this.courseService.updateQuizList(data.questionId,params).subscribe(resp=>{
      console.log(resp);
      if(resp && resp.isSuccess){
        this.alertService.success(resp.message);
        this.cancelQuizSubmit(i);
      }
    })
  }

  removeQuiz(template  : TemplateRef<any>,data){
    let modalConfig={
      class:"modal-dialog-centered"
    }
    console.log(data);
    this.deleteQueId = data.questionId;
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  deleteQuizQuestion(){
    this.courseService.deleteQuizList(this.deleteQueId).subscribe(resp=>{
      if(resp && resp.isSuccess){
        console.log(resp)
        this.modalRef.hide();
        this.alertService.success(resp.message);
        this.editQuizDetails();
      }
    })
  }
}
