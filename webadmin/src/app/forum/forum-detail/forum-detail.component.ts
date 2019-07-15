import { Component, OnInit } from '@angular/core';
import { ForumService,AlertService } from '../../services';
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
  viewComment = [false];
  constructor(private forumService: ForumService,
              public commonLabels: CommonLabels,
              private activatedRoute: ActivatedRoute,
              public forumVar: ForumVar,
              private alertService :AlertService) {
                this.activatedRoute.params.subscribe((params: Params) => {
                  this.forumId = params['forumId'];
              });
               }

  ngOnInit() {
    this.getDetails();
  }
  getDetails(){
    this.forumService.postList(this.forumId).subscribe(result => {
      if (result && result.isSuccess) {
        this.postList = result.data;
      } else {

      }
    });
  }

  removeData(type,id){
      // console.log(type,id)
      this.forumService.removeForumPost(id,type).subscribe(resp=>{
        if(resp && resp.isSuccess){
          // console.log(resp)
          this.alertService.success(resp.data);
          this.getDetails();
          this.viewComment = [false];
        }
      })
  }


}
