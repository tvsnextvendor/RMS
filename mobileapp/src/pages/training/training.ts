import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, Content } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { TrainingDetailPage } from '../training-detail/training-detail';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../../service';

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
  selectedModule;
  modules;
  moduleId = 0;
  showAssigned: boolean = false;
  showProgress: boolean = true;
  showCompleted: boolean = true;
  detailObject;
  statusKey;
  userInformation: any = [];
  userAssigned: any;
  userProgress: any;
  userCompleted: any;
  allCourses: any = [];
  assignedCoursesList = [];
  progressCoursesList = [];
  completeCoursesList = [];
  assign: any = [];
  progress: any = [];
  complet: any = [];
  @ViewChild(Content) content: Content;
  allProgramsAssignedCourses = [];
  allProgramsProgressCourses = [];
  allProgramsCompletedCourses = [];
  totalCount;
  courseIdParams;
  allTrainingClasses;
  allTrainingClassesCount;
  uploadPath;
  currentUser;
  trainingScheduleId;

  timeBegan = null
  timeStopped:any = null
  stoppedDuration:any = 0
  started = null
  running = false
  blankTime = "00:00.000"
  time = "00:00.000"

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpProvider, public constant: Constant, public apiUrl: API_URL, public storage: Storage,public loader: LoaderService) {
    this.detailObject = this.navParams.data;
    this.courseIdParams = this.detailObject.courseId;
    this.trainingScheduleId = this.detailObject.trainingScheduleId;
    this.statusKey = this.detailObject['status'] ? this.detailObject['status'] : 'assigned';
    this.selectedModule = constant.pages.dashboardLabels.selectModules;
  }
  @ViewChild('myTabs') tabRef: Tabs;
 
    ngOnInit(){
      let self = this;
      this.storage.get('currentUser').then((user: any) => {
          if (user) {
              self.currentUser = user;
              this.getCourseTrainingClasses();
          }
      });
   }
  
  ionViewDidEnter() {
      this.assignedCoursesList = [];
      this.progressCoursesList = [];
      this.completeCoursesList = [];
      this.allProgramsAssignedCourses = [];
      this.allProgramsProgressCourses = [];
      this.allProgramsCompletedCourses = [];
      this.selectedModule = this.constant.pages.dashboardLabels.selectModules;
      this.showData(this.statusKey);
      //this.getCousesList();
      this.getModules();
   }


     start() {
    // if(this.running) return;
    if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
    }
    if (this.timeStopped !== null) {
      let newStoppedDuration:any = (+new Date() - this.timeStopped)
      this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
    }
    this.started = setInterval(this.clockRunning.bind(this), 10);
      this.running = true;
    }
    stop() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
   }
    reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = this.blankTime;
    }
    zeroPrefix(num, digit) {
      let zero = '';
      for(let i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    }
    clockRunning(){
      let currentTime:any = new Date()
      let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
      let hour = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()
      let ms = timeElapsed.getUTCMilliseconds();
      this.time =
        this.zeroPrefix(hour, 2) + ":" +
        this.zeroPrefix(min, 2) + ":" +
        this.zeroPrefix(sec, 2) + "." +
        this.zeroPrefix(ms, 3);
    };

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
          console.log('error occured userDashboardInfo empty', err);
          resolve('rejected');
        });
    });
  }
  
  getCourseTrainingClasses() {
    let self = this;
    let userId = this.currentUser.userId;
    let resortId = this.currentUser.ResortUserMappings[0].resortId;
    return new Promise(resolve => {
      this.http.get(API_URL.URLS.trainingCourseFilesAPI+'?courseId='+self.courseIdParams+'&trainingScheduleId='+this.trainingScheduleId+'&resortId='+ resortId +'&userId='+userId+'&type='+'mobile').subscribe((res) => {
        self.allTrainingClasses = res['data']['rows'];
        self.allTrainingClassesCount = res['data']['count'];
        self.uploadPath = res['data']['uploadPaths']['uploadPath'];
        resolve('resolved');
      }, (err) => {
        console.log('error occured', err);
        resolve('rejected');
      });
    });
  }

  goBack(){
    this.navCtrl.pop();
    // let paramsData = {};
    // paramsData['status'] = 'inProgress';
    // this.navCtrl.push('course-page', paramsData);
  }

  goToForum() {
    this.navCtrl.push('forum-page');
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
    this.statusKey = show;
    this.selectedCourses(this.moduleId, show);
  }

  getModules() {
    this.http.getData(API_URL.URLS.getModules).subscribe((data) => {
      if (data['isSuccess']) {
        this.modules = data['programList'];
      }
    });
  }
  //open  page
  openTrainingDetail(data) {
    this.paramsData['trainingClassId'] = data.CourseTrainingClassMaps[0].trainingClassId;
    this.paramsData['courseId'] = data.CourseTrainingClassMaps[0].courseId;
    this.paramsData['status'] = data.FeedbackMappings.length ? data.FeedbackMappings[0].status : 'inProgress';    
    this.paramsData['setData'] = this.detailObject;
    this.paramsData['setData']['passPercentage'] = data.CourseTrainingClassMaps[0].Course.TrainingScheduleCourses[0].passPerc;
    this.paramsData['trainingScheduleId'] = this.trainingScheduleId;
    this.navCtrl.push(TrainingDetailPage, this.paramsData);
  }

  checkCompleted(data){
   let status = data.FeedbackMappings.length ? 'completed' : 'noQuiz';
   return status;
  }

  //getcourse 
  async getCousesList() {
    this.loader.showLoader();
    // await this.getLocalStorageInfo();
    //await this.getCoursesSeparate();
    this.loader.hideLoader();
  }
  changeModule(list) {
    this.selectedModule = list.name;
    this.moduleId = list.id;
    this.selectedCourses(list.id, this.statusKey);
  }
  resetToAllCourses() {
    this.assignedCoursesList = this.allProgramsAssignedCourses;
    this.progressCoursesList = this.allProgramsProgressCourses;
    this.completeCoursesList = this.allProgramsCompletedCourses;
    if (this.statusKey === 'assigned') {
      this.totalCount = this.allProgramsAssignedCourses.length;
    } else if (this.statusKey === 'inprogress') {
      this.totalCount = this.allProgramsProgressCourses.length;
    } else if (this.statusKey === 'complete') {
      this.totalCount = this.allProgramsCompletedCourses.length;
    }
  }
  selectedCourses(moduleId, status) {
    this.resetToAllCourses();
    this.assign = [];
    this.progress = [];
    this.complet = [];
    let self = this;
    if (moduleId !== 0) {
      if (status === 'assigned') {
        this.assignedCoursesList = this.allProgramsAssignedCourses;
        this.assignedCoursesList.map(function (value) {
          if (value.moduleId === self.moduleId) {
            self.assign.push(value);
          }
        });
        this.assignedCoursesList = [];
        this.assignedCoursesList = this.assign;
        this.totalCount = this.assign.length;
      }
      if (status === 'inprogress') {
        this.progressCoursesList = this.allProgramsProgressCourses;
        this.progressCoursesList.map(function (value) {
          if (value.moduleId === self.moduleId) {
            self.progress.push(value);
          }
        });
        this.progressCoursesList = [];
        this.progressCoursesList = this.progress;
        this.totalCount = this.progress.length;
      }
      if (status === 'complete') {
        this.completeCoursesList = this.allProgramsCompletedCourses;
        this.completeCoursesList.map(function (value) {
          if (value.moduleId === self.moduleId) {
            self.complet.push(value);
          }
        });
        this.completeCoursesList = [];
        this.completeCoursesList = this.complet;
        this.totalCount = this.complet.length;
      }
    } else {
      this.resetToAllCourses();
    }
  }
 
}
