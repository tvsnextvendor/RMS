import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams, Content } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { Storage } from '@ionic/storage';
import { API_URL } from '../../constants/API_URLS.var';
import { LoaderService, SocketService} from '../../service';
import * as moment from 'moment';

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Constant]
})
export class HomePage {
   
  notificationCount;
  currentUser;
  status;
  enableView;
  todayDate;
  enableIndex;
  interval;
  totalPage;
  paramsData={};
  dashboardInfo: any = [];
  dashboardCount: any = {};
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.five;


  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,public socketService: SocketService, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public loader: LoaderService) {
 
  }

   
  ionViewWillEnter(){
    let self = this;
    this.status = 'assigned';
    this.storage.get('currentUser').then((user: any) => {
        if (user.token) {
            self.currentUser = user;
            this.getNotification();
            this.getDashboardInfo();
            this.getDashboardCount();
        }
    });
  }

   ngAfterViewInit() {
      this.interval = setInterval(() => {
        this.currentPage = 1;
        this.scrollEnable = false;
          this.getDashboardInfo();
          this.getDashboardCount();
      }, 15000);      
  }

  navPage(page, data){
    switch (page) {
      case 'notification':
        this.navCtrl.push('generalnotification-page');
        break;
      case 'signReq':
        this.paramsData['tab'] = page;
        this.navCtrl.push('course-page',this.paramsData);
        break;
      case 'course':
        this.paramsData['status'] = this.status;
        this.navCtrl.push('course-page', this.paramsData);
        break;
      case 'trainingClass' :
        this.paramsData['courseId'] = data.courseId;
        this.paramsData['trainingScheduleId'] = data.trainingScheduleId;
        this.paramsData['status'] = this.status;
        this.navCtrl.push('training-page',this.paramsData);
        break;
      default:
         this.navCtrl.push('course-page');
        break;
    }
  }
  
  changeStatus(type){
    this.status=type;
    this.getDashboardInfo();
    this.enableView = false;
    this.enableIndex = 0;
  }
  
  hideShowDesc(i){
    this.enableView = this.enableIndex === i ? !this.enableView : true;
    this.enableIndex = i;
  }

   calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return a.to(b, true);
  }

   //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.getDashboardInfo();
            event.complete(); //To complete scrolling event.
        }, 1000);
    }

  getDashboardInfo() {
    let userId= this.currentUser.userId;
    this.http.get(API_URL.URLS.dashboardSchedules+'?status='+this.status+'&userId='+userId+'&page='+this.currentPage+'&size='+this.perPageData).subscribe((res) => {
      if(res['isSuccess']){
        let totalData = res['data']['count'];
        this.totalPage = totalData / this.perPageData;
        if (this.scrollEnable) {
            for (let i = 0; i < res['data']['rows'].length; i++) {
                this.dashboardInfo.push(res['data']['rows'][i]);
            }
        } else {
            this.dashboardInfo = res['data']['rows'];
        }
      }
    });
  }

  getDashboardCount(){
    let userId= this.currentUser.userId;
    let resortId = this.currentUser.ResortUserMappings[0].resortId;
    this.http.get(API_URL.URLS.dashboardCount+'?userId='+userId+'&resortId='+resortId).subscribe((res)=>{
       if(res['isSuccess']){
         this.dashboardCount= res['data'];
       }
      //  else{
      //    this.dashboardCount.courseExpire = 0;
      //    this.dashboardCount.signatureReq = 0;
      //    this.dashboardCount.generalNotification = 0;         
      //  }
    })
  }
   
  goToNotification(){
    this.navCtrl.push('notification-page');
  }
  
  goToForum(){
     this.navCtrl.push('forum-page');
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

  ngOnDestroy(){
    if (this.interval) {
        clearInterval(this.interval);
    }
  }

}
