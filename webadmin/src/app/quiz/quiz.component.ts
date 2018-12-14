import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { HttpService } from '../services/http.service';
import { QuizVar } from '../Constants/quiz.var';
import { API_URL } from '../Constants/api_url';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']

})
export class QuizComponent implements OnInit {

  quizData = [];
  moduleList;
  moduleType = null;
  title: string = "Quiz";
  hidemodule = true;
  apiUrls;

  constructor(private headerService: HeaderService, private route: Router, private http: HttpService, private constant: QuizVar) {  this.apiUrls=API_URL.URLS;}

  ngOnInit() {
    this.getQuizDetails();
    this.headerService.setTitle({title:"Quiz", hidemodule:true});
  }
  // Quil List GET API Service
  getQuizDetails() {
    //'5c0f73143100002c0924ec31'
    this.http.get(this.apiUrls.getQuiz).subscribe((resp) => {
      this.quizData = resp.QuizDetails;
    });
  }
  // Edit Add Redirections
  quizDetails(courseId, data) {
    if (courseId) {
      this.route.navigateByUrl('/quizdetails/' + courseId + '/' + data.VideoId);
    }
    else {
      this.route.navigateByUrl('/quiz/add');
    }
  }
}
