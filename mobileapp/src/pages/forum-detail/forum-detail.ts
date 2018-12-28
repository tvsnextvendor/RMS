import { Component, OnInit, TemplateRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { ToastrService } from '../../service/toastrService';

@IonicPage({
  name: 'forumdetail-page'
})
@Component({
  selector: 'page-forum-detail',
  templateUrl: 'forum-detail.html',
})
export class ForumDetailPage implements OnInit {

  forumTopics: any;
  QuestionForm: FormGroup;
  forum = {
    'question': ''
  }
  forumDetailObject;
  indexs;
  employees;
  like: boolean = false;
  forumFavor: any = [];
  forumRecent: any = [];
  forumFeature: any = [];
  recentList: any = [];
  favoriteList: any = [];
  featureList: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private modalService: BsModalService, public constant: Constant,private toastr:ToastrService) {
    this.forumDetailObject = this.navParams.data;
    this.employees = this.forumDetailObject['setData']['employees'];
    this.indexs = this.forumDetailObject['selectedIndex'];
  }
  ionViewDidLoad() {
    this.forumTopics = 'mostRecent';
    console.log('ionViewDidLoad ForumPage');
  }
  ionViewDidEnter() {
    this.getTopicsRelated();
  }
  ngOnInit() {
    this.forumTopics = 'mostRecent';
    this.QuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required])
    });
  }
  getTopicsRelated() {
    var self = this;
    this.employees.map(function (val, key) {
      val = Object.assign({}, val);
      val.isActive = false;
      if (val.status === 'Recent') {
        self.recentList.push(val);
      } else if (val.status === 'Featured') {
        self.featureList.push(val);
      } else if (val.status === 'Favourite') {
        self.favoriteList.push(val);
      }
    });
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  questionSubmit() {
    console.log(this.forum);
    this.toastr.success("Question Saved Successfully");
    this.modalRef.hide();
  }
  likeUnlikeQuestion(emp, j) {
    emp[j]['like'] = !(emp[j]['like']);
  }
  hideShowDesc(emp, j) {
    emp[j]['isActive'] = !(emp[j]['isActive']);
  }
}
