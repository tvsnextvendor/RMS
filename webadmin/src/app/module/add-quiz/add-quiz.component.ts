import { Component, OnInit ,Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from '../../services/header.service';
import { HttpService } from '../../services/http.service';
import { QuizVar } from '../../Constants/quiz.var';
import { API_URL } from '../../Constants/api_url';

@Component({
  selector: 'add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']

})
export class AddQuizComponent implements OnInit {

  @Input() courseId;
  @Input() videoId;
  videoDetails = [];
  // courseId;
  // videoId;
  quizDetails = [];
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
  
  constructor(private headerService: HeaderService, private route: Router, private http: HttpService, private activatedRoute: ActivatedRoute, private constant: QuizVar,private toastr: ToastrService) {
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
      "QuestionId": 1,
      "Question": "",
      "QuestionType": "1",
      "Options": [
        { "Id": 1, "Value": "" },
        { "Id": 2, "Value": "" },
        { "id": 3, "Value": "" },
        { "Id": 4, "Value": "" }
      ],
      "Weightage": '100'
    }];

    this.courseOptions = [
      { name: "Uniform and Appearance Policy", value: "1" },
      { name: "Park Smart Safety", value: "2" },
      { name: "Basic Rails", value: "3" },
      { name: "Welcome to 2018/19", value: "4" }
    ];
    this.videoOptions = [
      { name: "Video name 1", value: "1" },
      { name: "Video name 2", value: "2" },
      { name: "Video name 3", value: "3" },
      { name: "Video name 4", value: "4" }
    ];


    if (this.courseId) {
      //'5c0f73143100002c0924ec31'
      this.editQuizDetails();
    }
    else {
      this.weightage = 100;
    }
    this.headerService.setTitle({title: this.title, hidemodule: this.hidemodule});
  }


  editQuizDetails(){
    this.http.get(this.apiUrls.getQuiz).subscribe((resp) => {
      this.videoDetails = resp.QuizDetails;
      let slectedQuizDetails = resp.QuizDetails.find(x => x.CourseId === this.courseId);
      let selectedVideoList = slectedQuizDetails && slectedQuizDetails.Videos && slectedQuizDetails.Videos.find(x => x.VideoId === this.videoId);
      this.selectedVideo = this.videoId;
      this.selectedCourse = this.courseId;
      this.quizQuestionsForm = selectedVideoList && selectedVideoList.QuestionsDetails ? selectedVideoList.QuestionsDetails : [{
        "QuestionId": 1,
        "Question": "",
        "QuestionType": "1",
        "Options": [
          { "Id": 1, "Value": "" },
          { "Id": 2, "Value": "" },
          { "id": 3, "Value": "" },
          { "Id": 4, "Value": "" }
        ],
        "Weightage": '100'
      }];
      this.weightage = selectedVideoList && selectedVideoList.QuestionsDetails  ? (100 / selectedVideoList.QuestionsDetails.length).toFixed(2) : 100;
    });
  }
   // Select options toggle
  questionTypeUpdate(data, i) {
    let quiz = this.quizQuestionsForm;
    quiz[i].QuestionType = data;
    if (data === "1") {
      quiz[i].Options = [
        { "Id": 1, "Value": "" },
        { "Id": 2, "Value": "" },
        { "id": 3, "Value": "" },
        { "Id": 4, "Value": "" }
      ];
    }
    else {
      quiz[i].Options = [];
    }
  }


  courseChange(){
    // this.selectedCourse = 1;
    console.log(this.selectedCourse);
  }

  // Add Question Box
  addQuestionForm() {
    let obj = {
      "QuestionId": 1,
      "Question": "",
      "QuestionType": "1",
      "Options": [
        { "Id": 1, "Value": "" },
        { "Id": 2, "Value": "" },
        { "id": 3, "Value": "" },
        { "Id": 4, "Value": "" }
      ],
      "Weightage": '100'
    };
    obj.QuestionId = this.quizQuestionsForm.length + 1;
    this.quizQuestionsForm.push(obj);
    obj.Weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
  }

  // Remove Question Box
  removeQuestionForm(index) {
    this.quizQuestionsForm.splice(index, 1);
  }
  // Quiz Submission
  quizSubmit() {
    //Weightage update
    let data = this.quizQuestionsForm.map(item => {
        item.Weightage = (100 / this.quizQuestionsForm.length).toFixed(2);
        return item;
    })
    //final data for submission
    let params = {
      "CourseId" : this.selectedCourse,
      "VideoId" : this.selectedVideo,
      "QuizDetails" : data
    }
    console.log(params);
    if(this.courseId){
      this.toastr.success("Quiz updated successfully");
      // this.route.navigateByUrl('/quiz');
    }
    else{
      this.toastr.success("Quiz added successfully");
      // this.route.navigateByUrl('/module')
    }
    
  }
}
