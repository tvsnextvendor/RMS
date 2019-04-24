import { Component, OnInit,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { CourseService } from '../../services/restservices/course.service';
// import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-quiz-tab',
  templateUrl: './quiz-tab.component.html',
  styleUrls: ['./quiz-tab.component.css']
})
export class QuizTabComponent implements OnInit {
  @Input() trainingClassId;
  @Input() courseId;
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
  
  constructor(private courseService:CourseService,private headerService: HeaderService,private alertService:AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, public constant: QuizVar,private toastr: ToastrService) {
    // this.apiUrls = API_URL.URLS;
  }
  
  ngOnInit() {
    // this.selectedVideo = this.videoId ? this.videoId : null;
    // this.selectedCourse = this.courseId ? this.courseId : null;
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

    // if (this.courseId) {
      //'5c0f73143100002c0924ec31'
      this.editQuizDetails();
    // }
    // else {
      this.weightage = 100;
    // }
  }

  optionValueUpdate(){
    this.optionData = !this.optionData;
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
       
        this.quizQuestionsForm = QuizList && QuizList.length ? QuizList : [{
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

  // Quiz Submission
  quizSubmit() {
    // if(this.selectCourseName){
    //   let data = this.quizQuestionsForm.map(item => {
    //       item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
    //       return item;
    //   })
    //   let params = {
    //     "trainingClassName":this.selectCourseName,
    //     "files":[],
    //     "quizQuestions":data
    //     }
    //     if(this.videoList.length){
    //       params.files = this.videoList.map(item=>{
    //         let obj = {
    //           fileName : item.videoName,
    //           fileDescription : item.description,
    //           fileType : item.fileType,
    //           fileUrl : item.url
    //         }
    //         return obj;
    //       })
    //     }
    //   if(this.courseId){
    //     this.valueChanged(true);
    //   }
    //   else{
    //     console.log(JSON.stringify(params));
    //     this.courseService.addTrainingClass(params).subscribe((result)=>{
    //       console.log(result)
    //     })
      
    //     this.valueChanged(false);
    //     this.redirectCourseList();
    //   }
    // }
    // else{
    //   this.alertService.error("Training Class is mandatory");
    //   this.courseId ? 
    //     this.valueChanged(true)
    //     :
    //     this.valueChanged(false);
    //     this.redirectCourseList();
    // }
  }

  redirectCourseList(){
    this.route.navigateByUrl('/cms-library');
  }

  editQuizEnable(i){
    this.quizQuestionsForm[i].enableEdit = true;
  }
}
