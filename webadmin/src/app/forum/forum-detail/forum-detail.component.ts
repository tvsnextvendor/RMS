import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';
import {ForumVar} from '../../Constants/forum.var';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {
  forumId;
  postList: Array<any> = [];
  viewComment = false;
  constructor(private forumService: ForumService,
              public commonLabels: CommonLabels,
              private activatedRoute: ActivatedRoute,
              public forumVar: ForumVar) {
                this.activatedRoute.params.subscribe((params: Params) => {
                  this.forumId = params['forumId'];
              });
               }

  ngOnInit() {
    this.forumService.postList(this.forumId).subscribe(result => {
      this.postList = result.data;
    });

  }


}
