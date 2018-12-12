import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HeaderService} from '../services/header.service';
import {HttpService} from '../services/http.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']

})
export class QuizComponent implements OnInit {
 
  quizData = [];
  moduleList;
  moduleType = null;

  constructor(private headerService: HeaderService,private route: Router,private http : HttpService) { }

  ngOnInit() {
    this.getModuleList();
    this.getQuizDetails();
    this.headerService.setTitle('Quiz');
  
  }

  getQuizDetails(){
    this.http.get('5c0f73143100002c0924ec31').subscribe((resp) => {
      this.quizData = resp.QuizDetails;
      //  console.log(resp);
    });
  }
  onChangeModule(){
    console.log(this.moduleList)
  }
  quizDetails(courseId,data){
    if(courseId){
      this.route.navigateByUrl('/quizdetails/'+courseId+'/'+data.VideoId);
    }
    else{
      this.route.navigateByUrl('/quiz/add');
    }
  }
  
  getModuleList(){
    this.http.get('5c08da9b2f00004b00637a8c').subscribe((data) => {
      this.moduleList= data.ModuleList;
    });
}


}
