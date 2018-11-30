import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { TrainingDetailPage } from '../training-detail/training-detail';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';



@IonicPage({
  name: 'training-page'
})
@Component({
  selector: 'page-training',
  templateUrl: 'training.html',
  providers: [Constant]
})
export class TrainingPage {
  training;
  assignedList;
  inprogressList;
  completedList;
  paramsData = {};

  showAssigned: boolean = false;
  showProgress: boolean = true;
  showCompleted: boolean = true;
  detailObject;
  statusKey;

  userInformation: any = [];
  userAssigned: any;
  userProgress: any;
  userCompleted: any;
  allCourses:any = [];
  assignedCoursesList = [];
  progressCoursesList = [];
  completeCoursesList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpProvider, public constant: Constant, public apiUrl: API_URL, public loadingCtrl: LoadingController, public storage: Storage) {
    this.detailObject = this.navParams.data;
    this.statusKey = this.detailObject['status'] ? this.detailObject['status'] : 'assigned';
  }
  @ViewChild('myTabs') tabRef: Tabs;
  //first load
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainingPage');
   // this.getTrainingList();
    this.showData(this.statusKey);
    this.getCousesList();
  }
  getLocalStorageInfo() {
    return new Promise(resolve => {
        this.storage.get('userDashboardInfo').then(
          (val) => {
            this.userInformation = val.users[0];
            this.userAssigned = this.userInformation.assignedCourses;
            this.userProgress = this.userInformation.inProgressCourses;
            this.userCompleted = this.userInformation.completedCourses;
            resolve('resolved');
          }, (err) => {
            console.log('error occured', err);
            resolve('rejected');
          });
    });
  }

  // show tabs
  showData(show) {
    switch (show) {
      case 'assigned':
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
        break;
      case 'inprogress':
        this.showAssigned = true;
        this.showProgress = false;
        this.showCompleted = true;
        break;
      case 'complete':
        this.showAssigned = true;
        this.showProgress = true;
        this.showCompleted = false;
        break;
      default:
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
    }
  }

  // get training list
  getTrainingList() {
    this.http.getData(API_URL.URLS.getTraining).subscribe((data) => {
      this.training = data;
      this.assignedList = this.training.assigned;
      this.inprogressList = this.training.inprogress;
      this.completedList = this.training.completed;
    });
  }
  //open  page
  openTrainingDetail(detailObj, selectedIndex) {
    this.paramsData['setData'] = detailObj;
    this.paramsData['selectedIndex'] = selectedIndex;
    this.navCtrl.push(TrainingDetailPage, this.paramsData);
  }
  //getcourse 
  async getCousesList() {
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
  
    // loading.present();


    await this.getLocalStorageInfo();
  
    this.http.getData(API_URL.URLS.getCourses).subscribe((data) => {
    
      this.allCourses = data; 
      var self = this;
      this.userAssigned.map(function (value,key) {
        let assignedobject =  self.allCourses.find(x => x.courseId === value);
        self.assignedCoursesList.push(assignedobject);
      });
      this.userProgress.map(function (value,key) {
        let progressObject =  self.allCourses.find(x => x.courseId === value);
        self.progressCoursesList.push(progressObject);
      });
      this.userCompleted.map(function (value,key) {
        let completedObject =  self.allCourses.find(x => x.courseId === value);
        self.completeCoursesList.push(completedObject);
      });
     // loading.dismiss();
    });
  }

}
