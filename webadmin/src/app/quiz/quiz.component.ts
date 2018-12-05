import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']

})
export class QuizComponent implements OnInit {
 

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle('Quiz');
  }

  


}
