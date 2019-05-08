import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../services/header.service';
import { CommonLabels} from '../Constants/common-labels.var'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  constructor(private headerService:HeaderService,public commonLabels : CommonLabels) { }

  ngOnInit() {
    this.headerService.setTitle({title:'FeedBack', hidemodule:false});
  }

}
