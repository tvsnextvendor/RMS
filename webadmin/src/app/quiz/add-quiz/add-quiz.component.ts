import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {HeaderService} from '../../services/header.service';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']

})
export class AddQuizComponent implements OnInit {
 
  videoDetails = [];
  courseId;
  videoId;
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
  constructor(private headerService: HeaderService,private route: Router,private http : HttpService,private activatedRoute: ActivatedRoute) {
    this.courseId = activatedRoute.snapshot.params['id'];
    this.videoId = activatedRoute.snapshot.params['videoId'];
   }

  ngOnInit() {
    this.selectedVideo = this.videoId ? this.videoId  : "1";
    this.selectedCourse= this.courseId ? this.courseId : "1";
    this.questionOptions = [
      {name:"MCQ",value:"1"},
      {name:"True/False",value : "2"}
    ];
    this.questionForm = {
      "QuestionId" : '',
      "Question" : "",
      "QuestionType" : "1",
      // "Value" : '1',
      "Options" : [
        {"Id" : 1,"Value":""},
        {"Id" : 2,"Value":""},
        {"id" : 3,"Value":""},
        {"Id" : 4,"Value":""}
      ],
      "Weightage" : '100'
      };
    if(this.courseId){ 
      this.http.get('5c0f73143100002c0924ec31').subscribe((resp) => {
        this.videoDetails = resp.QuizDetails;
          let slectedQuizDetails = resp.QuizDetails.find(x => x.CourseId === this.courseId);
          let selectedVideo = slectedQuizDetails && slectedQuizDetails.Videos && slectedQuizDetails.Videos.find(x=>x.VideoId === this.videoId);
          this.quizDetails = selectedVideo.QuestionsDetails;
          this.weightage = (100/selectedVideo.QuestionsDetails.length).toFixed(2);
          console.log(this.quizDetails);
          this.headerService.setTitle('Quiz/'+slectedQuizDetails.CourseName+'/'+selectedVideo.VideoName);
        });   
    }
    else{
      this.headerService.setTitle('Add quiz');
      this.questionForm.QuestionId = "1";
        this.quizDetails.push(this.questionForm);
        this.weightage = 100;
        this.courseOptions = [
          {name:"Uniform and Appearance Policy",value:"1"},
          {name:"Park Smart Safety",value : "2"},
          {name:"Basic Rails",value : "3"},
          {name:"Welcome to 2018/19",value : "4"}
        ];
        this.videoOptions = [
          {name:"Video name 1",value:"1"},
          {name:"Video name 2",value : "2"},
          {name:"Video name 3",value : "3"},
          {name:"Video name 4",value : "4"}
        ];
    }
  }

  questionTypeUpdate(data,i){
    console.log(data,i);
    let quiz = this.quizDetails;
      quiz[i].QuestionType = data;
      if(data === "1"){
        quiz[i].Options = [
          {"Id" : 1,"Value":""},
          {"Id" : 2,"Value":""},
          {"id" : 3,"Value":""},
          {"Id" : 4,"Value":""}
        ];
      }
      else{
        quiz[i].Options = [];
      }
      console.log(quiz)
  }

  courseUpdate(data){
    console.log(data)
  }

  videoUpdate(data){
    console.log(data)
  }

  optionUpdate(e,oi,i){
    debugger;
    console.log(e.target.value,oi,i)
  }

  addQuestion(){
    let addArray = this.questionForm;
    addArray.QuestionId = this.quizDetails.length+1;
    debugger;
    this.quizDetails.push(addArray);
    this.weightage = (100/this.quizDetails.length).toFixed(2);
    console.log(this.quizDetails)
  }

  quizSubmit(data){
    console.log(this.quizDetails)
  }

  removeQuestion(index){
      let queList = this.quizDetails;
      queList.splice(index,1);
      this.quizDetails = queList;
  }

  questionUpdate(data,i){
    console.log(data,i)
  }

}
