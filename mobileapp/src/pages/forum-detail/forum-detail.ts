import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { ToastrService } from '../../service/toastrService';
import { API_URL } from '../../constants/API_URLS.var';
import { HttpProvider } from '../../providers/http/http';
import { Storage } from '@ionic/storage';
import { ModalPage } from '../modal/modal';
import { LoaderService } from '../../service';
import * as moment from 'moment';


@IonicPage({
  name: 'forumdetail-page'
})
@Component({
  selector: 'page-forum-detail',
  templateUrl: 'forum-detail.html',
})
export class ForumDetailPage implements OnInit {

  @ViewChild(Content) content: Content;

  forumTopics: any;
  QuestionForm: FormGroup;
  forum = {
    'question': ''
  }
  forumDetailObject;
  indexs;
  employees;
  topics;
  forumId;
  editComment;
  commentId;
  editDisable = true;
  forumFavor: any = [];
  forumRecent: any = [];
  forumFeature: any = [];
  recentList: any = [];
  favoriteList: any = [];
  featureList: any = [];
  commentList: any = [];
  like: boolean = false;
  currentUser;
  userId;
  comment;
  createdBy;
  description;
  postId;
  status;
  isComment = false;
  isAnswer = false;
  isActive = false;
  hideQuestionBtn: boolean = true;
  showToastr: boolean = false;
  className;
  msgTitle;
  msgDes;
  commentErr = false;
  quesErr= false;
  quesDisable= false;

  constructor(public navCtrl: NavController, public loader: LoaderService, public navParams: NavParams, private modalService: BsModalService, public constant: Constant, private toastr: ToastrService, public API_URL: API_URL, private http: HttpProvider, private storage: Storage, public modalCtrl: ModalController) {
    this.forumDetailObject = this.navParams.data;
    //this.employees = this.forumDetailObject['setData']['employees'];
    this.topics = this.forumDetailObject['setData']['topics'];
    this.forumId = this.forumDetailObject['setData']['forumId'];
    this.indexs = this.forumDetailObject['selectedIndex'];
  }
  ionViewDidLoad() {
    this.forumTopics = 'mostRecent';
  }
  ionViewDidEnter() {
    this.status = 'recent';
    this.getTopicsRelated();

  }

  calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return b.to(a, true);
  }

  ngOnInit() {
    this.forumTopics = 'mostRecent';
    this.QuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required])
    });
    this.getUser();
    //this.getComments();
  }
  getTopicsRelated() {
    this.loader.showLoader();
    this.http.get(API_URL.URLS.post + '?forumId=' + this.forumId + '&status=' + this.status).subscribe((res) => {
      if (res['isSuccess']) {
        this.recentList = res['data'];
      } else {
        this.recentList = [];
      }
      this.loader.hideLoader();
    });
  }

  modalRef: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.quesErr = false;
    this.quesDisable = false
    this.modalRef = this.modalService.show(template);
  }

  openEditModal(template: TemplateRef<any>, comment) {
    this.commentErr = false;
    this.editComment = comment.description;
    this.commentId = comment.commentId;
    this.postId = comment.postId;
    this.description = comment.description;
    this.createdBy = comment.createdBy;
    this.modalRef = this.modalService.show(template);
  }

  changeEditInput() {
    this.editDisable = false;
  }

  updateComment() {
    let postData = {
      'description': this.editComment,
      'postId': this.postId,
      'createdBy': this.createdBy
    }
    if(this.isempty(this.editComment) ){
      this.commentErr = true;
      this.editDisable = true;
    }else{
    this.http.put(false, API_URL.URLS.comment + '/' + this.commentId, postData).subscribe(res => {
      if (res['isSuccess']) {
        this.commentErr = false;
        this.editDisable = false;
        this.successMessage(res['data']);
        this.modalRef.hide();
        this.getTopicsRelated();
      }
    })
    }
  }

  //Add post
  questionSubmit() {
    let postData = {
      "description": this.forum.question,
      "forumId": this.forumId,
      "createdBy": this.currentUser.userId,
      "votesCount": 0
    }
    if(!this.forum.question || this.isempty(this.forum.question) ){
      this.quesErr = true;
      this.forum.question=""
      this.quesDisable = true;
    }else{
    this.loader.showLoader();
    this.http.post(false, API_URL.URLS.post, postData).subscribe(res => {
      if (res['isSuccess']) {
        this.successMessage(res['data']);
        this.quesErr= false;
        this.quesDisable = false;
        this.getTopicsRelated();
        this.forum.question = '';
        this.modalRef.hide();
      }
      this.loader.hideLoader();
    })
    }

  }
  successMessage(msg){

    this.showToastr = true;
    this.className = "notify-box alert alert-success";
    this.msgTitle = "Success";
    this.msgDes = msg ;
    let self = this;
    setTimeout(function(){ 
      self.showToastr = false;
      }, 3000); 

  }

  //change status between recent and fav.
  changeStatus(status) {
    this.status = status;
    this.getTopicsRelated();
  }

  //Make a post fav/unfav
  likeUnlikeQuestion(list, status) {
    let postData = {
      'isFavorite': status
    }
    this.loader.showLoader();
    this.http.put(false, API_URL.URLS.post + '/' + list.postId, postData).subscribe((res) => {
      if (res['isSuccess']) {
      //  this.toastr.success(res['data']);

      this.successMessage(res['data']);
        this.getTopicsRelated();
      }
      this.loader.hideLoader();
    });
  }

  //hide and show description part
  hideShowDesc(list, j) {
    this.hideQuestionBtn = true;
    list['isActive'] = !(list['isActive']);
    list['isComment'] = list['isComment'] ? false : '';
    list['isAnswer'] = list['isAnswer'] ? false : '';
  }


  showAnswers(list) {
    this.getComments(list['postId']);
    list['isAnswer'] = !list['isAnswer'];
    list['isComment'] = list['isComment'] ? false : '';

  }

  //hide and show comment part
  showCommentSet(list, j) {
    list['isComment'] = !(list['isComment']);
    list['isAnswer'] = list['isAnswer'] ? false : '';
    this.hideQuestionBtn = false;
  }

  //Get comments by postId
  getComments(id) {
    this.http.get(API_URL.URLS.comment + '/' + id).subscribe((res) => {
      if (res['isSuccess']) {
        this.commentList = res['data']['rows'];
      }
    });
  }

  getUser() {
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          this.currentUser = val;
          this.userId = this.currentUser.userId;
        }
      }, (err) => {
        console.log('currentUser not received in forum-detail.component.ts', err);
      });
  }

  saveComment(id, i) {
    let postData = {
      "description": this.comment,
      "createdBy": this.currentUser.userId,
      "postId": id
    } 
    if (!this.comment || this.isempty(this.comment)  ) {
      this.toastr.error("Comment is required");
    } else {
      this.http.post(false, API_URL.URLS.comment, postData).subscribe(res => {
        if (res['isSuccess']) {
          this.getTopicsRelated();
          this.getComments(id);
          this.successMessage(res['data']);
          this.comment = '';
        }
      })
    }
  }

   isempty(str) {
    return (!str || /^\s*$/.test(str));
  }

  likePost(list, status) {
    let postData = {};

    if (status == 'like') {
      list['like'] = true;
      postData['votesCount'] = list.votesCount + 1;
    }

    this.http.put(false, API_URL.URLS.post + '/' + list.postId, postData).subscribe(res => {
      if (res['isSuccess']) {
        this.getTopicsRelated();
      }
    })
  }

  deleteComment() {
    this.http.delete(API_URL.URLS.comment + '/' + this.commentId).subscribe(res => {
      if (res['isSuccess']) {
        this.successMessage(res['data']);
      //  this.toastr.success(res['data']);
        this.modalRef.hide();
        this.getTopicsRelated();
      }
    })
  }
  async presentModal(repliesObj) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { value: repliesObj }
    });
    return await modal.present();
  }
  goBackLevel() {
    this.navCtrl.push('forum-page');
  }
}
