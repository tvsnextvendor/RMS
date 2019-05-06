import { Component, OnInit } from '@angular/core';
import { CommonLabels } from '../../Constants/common-labels.var'
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {

  constructor(public commonLabels:CommonLabels,private headerService:HeaderService,) { }

  ngOnInit() {
    this.headerService.setTitle({title:this.commonLabels.titles.forumtitle, hidemodule:false});
  }

}
