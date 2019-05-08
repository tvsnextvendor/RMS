import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../services';
import { CommonLabels } from '../../Constants/common-labels.var';

@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.css']
})
export class ForumDetailComponent implements OnInit {
  forumId;
  postList: Array<any> = [];
  constructor(private forumService: ForumService,
              public commonLabels: CommonLabels) { }

  ngOnInit() {
    this.forumService.editForum.subscribe(result => {
      this.forumId = result['forumId'];
    });
    this.forumService.postList(this.forumId).subscribe(result => {
      this.postList = result.data;
    });

  }


}
