import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams, Content } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';
import { Storage } from '@ionic/storage';
import { API_URL } from '../../constants/API_URLS.var';
import { LoaderService, DataService} from '../../service';
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
   
  currentUser;
  status;
  enableView;
  todayDate;
  enableIndex;
  interval;
  totalPage;
  failedCount;
  paramsData={};
  dashboardInfo: any = [];
  dashboardCount: any = {};
  scrollEnable: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.five;


  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, private http: HttpProvider, public constant: Constant, public navParams: NavParams, public storage: Storage, public loader: LoaderService, public dataService: DataService) {
    this.dataService.getLoginData.subscribe(res => {
        if (res) {
           this.currentUser = res;
           this.getDashboardInfo();
           this.getDashboardCount();
        } else {
            console.log(res, "NOT GOTIT")
        }
    })
    
  }

   
  ngOnInit(){
    let self = this;
    this.status = 'assigned';
    this.storage.get('currentUser').then((user: any) => {
        if (user.token) {
            self.currentUser = user;
            this.getDashboardInfo();
            this.getDashboardCount();
            //this.getFailedCourse();
        }
    });
  }

   ionViewDidLoad() {
      this.interval = setInterval(() => {
        this.currentPage = 1;
        this.scrollEnable = false;
          this.getDashboardInfo();
          this.getDashboardCount();
      }, 4000);      
  }


  getFailedCourse() {
     let userId = this.currentUser.userId;
     let resortId = this.currentUser.ResortUserMappings[0].resortId;
      this.http.get(API_URL.URLS.failedList+'?userId=' + userId + '&resortId=' + resortId).subscribe((res) => {
        if(res['data']['rows']){
          this.failedCount = res['data']['count'];
          console.log(this.failedCount,"FailedCount");
        }
    })
  }

  //Navigate schedules to respective pages
  navPage(page, data){
    let pageName;
    if(page == 'scheduleType'){
       pageName = data.Resorts[0].NotificationFile.type;
    }else{
       pageName = page;
    }

    switch (pageName) {
      case 'general':
      case 'notification':
        this.navCtrl.push('generalnotification-page');
        break;
      case 'signRequired':
      case 'signReq':
        this.paramsData['tab'] = 'signReq';
        this.navCtrl.push('course-page',this.paramsData);
        break;
      case 'course':
        //this.changeTrainingStatus(data);
        this.paramsData['status'] = this.status;
        this.navCtrl.push('course-page', this.paramsData);
        break;
      case 'trainingClass' :
        //this.changeTrainingStatus(data);
        this.paramsData['courseId'] = data.courseId;
        this.paramsData['trainingScheduleId'] = data.trainingScheduleId;
        this.paramsData['status'] = this.status;
        this.navCtrl.push('training-page',this.paramsData);
        break;
      case 'trainingDetail' :
       //this.changeTrainingStatus(data);
        let paramsData = {};
        paramsData['trainingClassId'] = data.trainingClassId;
        paramsData['trainingScheduleId'] = data.trainingScheduleId;
        paramsData['setData'] = {};
        paramsData['setData']['typeSet'] = "Class";
        this.navCtrl.push('trainingdetail-page', paramsData);
        break;
      default:
         this.navCtrl.push('course-page');
        break;
    }
  }

    //Change status from "assigned" to "inprogress"
    changeTrainingStatus(data){
      if (this.status == 'assigned') {
          let userId = this.currentUser ? this.currentUser.userId : 8;   
          let postData = {
              'userId': userId,
              'status': "inProgress"
          } 
          if (data.Course) {
              postData['courseId'] = data.courseId;
              postData['typeSet'] = 'Course';
          } else {
              postData['trainingClassId'] = data.trainingClassId;
              postData['typeSet'] = 'Class';
          }
          this.http.put(false, API_URL.URLS.updateTrainingStatus, postData).subscribe((res) => {
          }, (err) => {
              console.log(err);
          });
      
      }
    }
  
  //tab change
  changeStatus(type){
    this.loader.showLoader();
    this.status=type;
    this.getDashboardInfo();
    this.loader.hideLoader();
    this.enableView = false;
    this.enableIndex = 0;
  }
  
  //open detail section
  hideShowDesc(i){
    this.enableView = this.enableIndex === i ? !this.enableView : true;
    this.enableIndex = i;
  }
 
  //Calculate expiry days 
   calculateExpireDays(duedate) {
    let dueDate = moment(duedate).format("YYYY-MM-DD");
    let todaysDate = moment(new Date()).format("YYYY-MM-DD");
    let tomDate = moment(new Date()).add(1,'days').format("YYYY-MM-DD");
    if(dueDate == todaysDate){
      let string = "Expires Today"
      return string;
    }else if(dueDate == tomDate){
      let string = "Will expire tomorrow"
      return string;
    }else{
    const a = moment(new Date());
    let string =  this.constant.pages.trainingLabels.willExpire +' ' + a.to(dueDate, true);
    return string;
    }
  }

   //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.getDashboardInfo();
            event.complete(); //To complete scrolling event.
        }, 2000);
    }

  //Get schedule data
  getDashboardInfo() {
    let userId= this.currentUser.userId;
    // +'&page=' + this.currentPage + '&size=' + this.perPageData
    this.http.get(API_URL.URLS.dashboardSchedules+'?status='+this.status+'&userId='+userId).subscribe((res) => {
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

 //get expiry schedule count
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
  
  //Navigate to forum
  goToForum(){
     this.navCtrl.push('forum-page');
  }

  ngOnDestroy(){
    if (this.interval) {
        clearInterval(this.interval);
    }
  }

}
