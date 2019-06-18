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
  
  
  dashboardInfo: any = [];
  dashboardCount:any ={};
  notificationCount;
  currentUser;
  status;
  todayDate;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,public socketService: SocketService, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public loader: LoaderService) {
 
  }
  //first load
  ionViewDidLoad() {
    this.todayDate = new Date();
  }

  
  ngAfterViewInit() {
            let self = this;
            this.status='assigned';
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
             this.getDashboardInfo();
              this.getNotification();
              this.getDashboardCount();
            }
        });
  }

  ionViewDidEnter() {
  }

  navPage(page){
    switch (page) {
      case 'notification':
        this.navCtrl.setRoot('generalnotification-page');
        break;
      case 'signReq':
        this.navCtrl.setRoot('course-page',page);
        break;
        case 'course' :
        this.navCtrl.setRoot('course-page',page);
        break;
      default:
         this.navCtrl.setRoot('course-page');
        break;
    }
  }
  
  changeStatus(type){
    this.status=type;
    this.getDashboardInfo();
  }
  
  hideShowDesc(list){
    list['isActive'] = !list['isActive'];
  }

   calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return a.to(b, true);
  }

  getDashboardInfo() {
    this.loader.showLoader();
    let userId= this.currentUser.userId;
    this.http.get(API_URL.URLS.dashboardSchedules+'?status='+this.status+'&userId='+userId).subscribe((res) => {
      this.loader.hideLoader();
      if(res['isSuccess']){
        this.dashboardInfo = res['data'];
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
    })
  }
   
  goToNotification(){
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

}
