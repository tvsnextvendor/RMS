import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { ForumDetailPage } from '../forum-detail/forum-detail';
@IonicPage({
  name: 'forum-page'
})
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [Constant]
})
export class ForumPage implements OnInit {
  forumData: any = [];
  paramsData:any= {'setData':[],'selectedIndex':''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL:API_URL) {
  }
  ionViewDidLoad() {
      console.log('ionViewDidLoad ForumPage');
  }
  ngOnInit() {
    this.getForumDatas();
  }
  goToForumDetail(detailObj,selectedIndex) {
    this.paramsData['setData'] = detailObj; 
    this.paramsData['selectedIndex'] = selectedIndex;
    this.navCtrl.push(ForumDetailPage,this.paramsData);
   // this.navCtrl.setRoot('forumdetail-page', this.paramsData);
  }
  getForumDatas() {
    this.http.getData(API_URL.URLS.getForum).subscribe((data) => {
      if (data['isSuccess']) {
        this.forumData = data['ForumList'];
      }
    });
  }
}
