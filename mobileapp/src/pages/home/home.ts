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
  
  // dataDashboard: any = [];
  // currentdate;
  // paramsData = {};
  dashboardInfo: any = [];
  dashboardCount:any ={};
  // trainingDatas: any = {};
  // accomplishments: any = {};
  // modules: any = [];
  // showMore: boolean = false;
  // users: any;
  // selectedModule;
  // coursePercentage;
  // moduleId;
  // allModulesSet ;
  notificationCount;
  currentUser;
  status;
  todayDate;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,public socketService: SocketService, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public loader: LoaderService) {
    //this.currentdate = this.getCurrentTime();
    //this.selectedModule = constant.pages.dashboardLabels.selectModules;
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
            }
        });
  }

  ionViewDidEnter() {
    //this.getModules();
    this.getDashboardCount();
  }

  // goToChildPage(status) {
  //   this.paramsData['status'] = status;
  //   this.navCtrl.setRoot('training-page', this.paramsData)
  // }
  // goToAcc(set) {
  //   this.navCtrl.setRoot('accomplishment-page')
  // }
  
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
    this.http.get(API_URL.URLS.dashboardCount).subscribe((res)=>{
       if(res['isSuccess']){
         this.dashboardCount= res['data'];
       }
    })
  }
   
//   getModules() {
//     this.http.getData(API_URL.URLS.getModules).subscribe((data) => {
//       if (data['isSuccess']) {
//         this.modules = data['programList'];
//         this.allModulesSet = data['programList'];
//       }
//     });
//   }
//   getCurrentTime(){
//     let d      = new Date();
//     let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     let days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     return days[d.getDay()] + ',' + months[d.getMonth()] + ' ' + d.getDate();
//   }
//   changeModule(list){
//  //  _.remove(this.allModulesSet, list);
//     this.selectedModule = list.name;
//     this.moduleId = list.id;
//     this.trainingDatas = this.dashboardInfo.training[this.moduleId]?this.dashboardInfo.training[this.moduleId]:this.dashboardInfo.training[0];
//   }
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
