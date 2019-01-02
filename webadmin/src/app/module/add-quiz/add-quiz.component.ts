import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { API_URL } from '../../Constants/api_url';
import { AlertService } from '../../services/alert.service';

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
  @Output() valueChange = new EventEmitter();
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
  
  constructor(private headerService: HeaderService,private alertService:AlertService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, private constant: QuizVar,private toastr: ToastrService) {
    this.apiUrls = API_URL.URLS;
  }
  
  ngOnInit() {
    this.selectedVideo = this.videoId ? this.videoId : null;
    this.selectedCourse = this.courseId ? this.courseId : null;
    this.questionOptions = [
      { name: "MCQ", value: "1" },
      { name: "True/False", value: "2" }
    ];
    this.quizQuestionsForm = [{
      "questionId": 1,
      "question": "",
      "questionType": "1",
      "options": [
        { "id": 1, "value": "" },
        { "id": 2, "value": "" },
        { "id": 3, "value": "" },
        { "id": 4, "value": "" }
      ],
      "weightage": '100'
    }];

    // this.courseOptions = [
    //   { name: "Uniform and Appearance Policy", value: "1" },
    //   { name: "Park Smart Safety", value: "2" },
    //   { name: "Basic Rails", value: "3" },
    //   { name: "Welcome to 2018/19", value: "4" }
    // ];
    // this.videoOptions = [
    //   { name: "Video name 1", value: "1" },
    //   { name: "Video name 2", value: "2" },
    //   { name: "Video name 3", value: "3" },
    //   { name: "Video name 4", value: "4" }
    // ];


    if(this.enableQuiz){
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


  editQuizDetails(quizData){
    // this.http.get(this.apiUrls.getQuiz).subscribe((resp) => {
      // this.videoDetails = resp.QuizDetails;
      // let slectedQuizDetails = resp.QuizDetails.find(x => x.CourseId === this.courseId);
      // let selectedVideoList = slectedQuizDetails && slectedQuizDetails.Videos && slectedQuizDetails.Videos[0];
      let selectedVideoList = quizData;
      this.selectedVideo = this.videoId;
      this.selectedCourse = this.courseId;
      this.quizQuestionsForm = selectedVideoList && selectedVideoList.length ? selectedVideoList : [{
        "questionId": 1,
        "qquestion": "",
        "questionType": "1",
        "options": [
          { "id": 1, "value": "" },
          { "id": 2, "value": "" },
          { "id": 3, "value": "" },
          { "id": 4, "value": "" }
        ],
        "Wwightage": '100'
      }];
      this.weightage = selectedVideoList && selectedVideoList  ? (100 / selectedVideoList.length).toFixed(2) : 100;
    // });
  }
   // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    quiz[i].QuestionType = data;
    if (data === "1") {
      quiz[i].option = '';
      quiz[i].options = [
        { "Id": 1, "Value": "" },
        { "Id": 2, "Value": "" },
        { "id": 3, "Value": "" },
        { "Id": 4, "Value": "" }
      ];
    }
    else {
      quiz[i].options = [];
      quiz[i].option = "True/False"
    }
  }


  courseChange(){
    // // this.selectedCourse = 1;
    // console.log(this.selectedCourse);
  }

  // Add Question Box
  addQuestionForm() {
    let obj = {
      "questionId": 1,
      "question": "",
      "questionType": "1",
      "options": [
        { "id": 1, "value": "" },
        { "id": 2, "value": "" },
        { "id": 3, "value": "" },
        { "id": 4, "value": "" }
      ],
      "weightage": '100'
    };
    obj.questionId = this.quizQuestionsForm.length + 1;
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
    this.courseUpdate = true;
    let data = {
      courseUpdate : true,
      type : update ? true : false
    }
    this.valueChange.emit(data);
  }

  // Quiz Submission
  quizSubmit() {
    //Weightage update
    if(this.selectCourseName){
      let data = this.quizQuestionsForm.map(item => {
          item.weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
          return item;
      })
      //final data for submission
      let params = {
        "courseId":"",
        "courseName":this.selectCourseName,
        "videoDetails":[],
        "quizDetails":data
        }
        if(this.videoList.length){
          params.videoDetails = this.videoList.map(item=>{
            let obj = {
              videoName : item.videoName,
              description : item.description,
              url : item.url
            }
            return obj;
          })
        }
      if(this.courseId){
        params.courseId = this.courseId;
        console.log(params);
        // this.toastr.success("Quiz updated successfully");
        this.valueChanged(true);
      }
      else{
        console.log(params);
        // this.toastr.success("Quiz added successfully");
        this.valueChanged(false);
      }
    }
    else{
      //this.toastr.error("Course name is mandatory");
      this.alertService.error("Course name is mandatory");
      this.courseId ? 
        this.valueChanged(true)
        :
        this.valueChanged(false);
      
    }
  }
}
