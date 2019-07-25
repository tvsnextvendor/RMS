import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';

/**
 * Generated class for the TopicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'topic-page'
})
@Component({
  selector: 'page-topic',
  templateUrl: 'topic.html',
})
export class TopicPage {
  topicDetailObject;
  forumDetails=[];
  paramsData: any = { 'setData': [] };

  constructor(public navCtrl: NavController,public constant: Constant,public navParams: NavParams) {
        this.topicDetailObject = this.navParams.data;
        this.forumDetails.push(this.topicDetailObject['setData']);
        console.log(this.forumDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopicPage');
    console.log(this.navParams.data);
  }
  
   goToForumDetail(detailObj) {
    this.paramsData['setData'] = detailObj;
    this.navCtrl.push('forumdetail-page', this.paramsData);
  }

}
