import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import {SocketService } from '../../service';


@IonicPage({
  name: 'course-failed-page'
})

@Component({
  selector: 'page-course-failed',
  templateUrl: 'course-failed.html',
})
export class CourseFailedPage {
 
  showSearchBar;
  notificationCount;
  currentUser;
  search;
  courseList;
  totalPage;
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.five;
  

  constructor(public storage: Storage,public socketService: SocketService,public navCtrl: NavController,public constant: Constant,public navParams: NavParams, public http: HttpProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseFailedPage');
  }

  ngAfterViewInit(){
    let self = this;
    this.storage.get('currentUser').then((user: any) => {
        if (user) {
            self.currentUser = user;
            this.getFailedCourse('');
            this.getNotification();
        }
    });
  }

   goToNotification() {
    this.navCtrl.setRoot('notification-page');
  }

   goToForum(){
     this.navCtrl.setRoot('forum-page');
  }

   getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
      this.notificationCount = data['unReadCount'];
   });
  }


  openTrainingClass(courseId)
  {
      let paramsData = {};
      paramsData['courseId'] = courseId;
      paramsData['status'] = 'failed';
      this.navCtrl.setRoot('training-page',paramsData);
  }

   toggleSearchBox() {
    this.showSearchBar = !this.showSearchBar;
   }

   onInput($e) {
    if (this.search) {
      this.getFailedCourse(this.search)
    } else {
      this.showSearchBar = false;
      this.getFailedCourse('');
    }
  }

  onCancel($e) {
    this.showSearchBar = false;
    this.getFailedCourse('');
  }



  getFailedCourse(search) {
     let userId = this.currentUser.userId;
     let resortId = this.currentUser.ResortUserMappings[0].resortId;
      this.http.get(API_URL.URLS.failedList+'?userId=' + userId + '&resortId=' + resortId+'&search='+search+ '&page=' + this.currentPage + '&size=' + this.perPageData).subscribe((res) => {
        if(res['data']['rows']){
          let count = res['data']['count'];
          this.totalPage = count / this.perPageData;
          if(this.scrollEnable){
          console.log(this.courseList, "COurseList");
           for (let i = 0; i < res['data']['rows'].length; i++) {
              this.courseList.push(res['data']['rows'][i]);
           }
          }else{
            this.courseList = res['data']['rows'];
          }
        }
    })
  }

  //Infinite scroll event call
  doInfinite(event) {
      this.currentPage += 1;
      this.scrollEnable = true;
      setTimeout(() => {
          this.getFailedCourse('');
          event.complete(); //To complete scrolling event.
      }, 1000);
  }

}


