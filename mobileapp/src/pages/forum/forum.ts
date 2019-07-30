import { Component, OnInit,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

@IonicPage({
  name: 'forum-page'
})
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [Constant]
})
export class ForumPage implements OnInit {
  
  search='';
  totalPage;
  currentUser;
  forumData: any = [];
  paramsData: any = { 'setData': [] };
  showSearchBar: boolean = false;
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.five;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,public storage: Storage,public navParams: NavParams, public constant: Constant, public http: HttpProvider, public API_URL: API_URL) {
  }
  
  ngOnInit(){
    
  }

  goToTopic(detailObj){
     this.paramsData['setData'] = detailObj;
    this.navCtrl.push('topic-page',this.paramsData);
  }


   ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
               this.getForumDatas();
            }
        });
  }

   //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.getForumDatas();
            event.complete(); //To complete scrolling event.
        }, 1000);
    }
 
    getForumDatas() {
      let userId = this.currentUser.userId;
      this.http.get(API_URL.URLS.getForum +'?search='+this.search+'&userId='+userId+'&isActive='+1 +'&type='+'mobile'+'&page='+this.currentPage+'&size='+this.perPageData).subscribe((res) => {
        if (res['isSuccess']) {
          let totalData = res['data']['count'];
          this.totalPage = totalData / this.perPageData;
          if (this.scrollEnable) {
              for (let i = 0; i < res['data']['rows'].length; i++) {
                  this.forumData.push(res['data']['rows'][i]);
              }
          } else {
              this.forumData = res['data']['rows'];
          }
        }
      });
    }


  calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return b.to(a, true);
  }
  
  toggleSearchBox() {
    this.showSearchBar = !this.showSearchBar;
    this.getForumDatas();
  }

  onInput($e) {
    if (this.search) {
      this.getForumDatas();
    } else {
      //this.showSearchBar = false;
      this.search='';
      this.getForumDatas();
    }
  }

  onCancel($e) {
    //this.showSearchBar = false;
    this.search='';
    this.getForumDatas();
  }

  

}
