import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../services/header.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  constructor(private headerService:HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle({title:'FeedBack', hidemodule:false});
  }

}
