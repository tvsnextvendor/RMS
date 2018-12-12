import { Component, OnInit, TemplateRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
@IonicPage({
  name: 'forum-page'
})
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [Constant]
})
export class ForumPage implements OnInit {
  forumTopics: any;
  QuestionForm: FormGroup;
  forum = {
    'question': ''
  }
  like: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalService: BsModalService, public constant: Constant) {
  }
  ionViewDidLoad() {
    this.forumTopics = 'mostRecent';
    console.log('ionViewDidLoad ForumPage');
  }
  ngOnInit() {
    this.forumTopics = 'mostRecent';
    this.QuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required])
    });
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  questionSubmit() {
    console.log(this.forum);
  }
  likeUnlikeQuestion() {
    this.like = !this.like;
  }
}
