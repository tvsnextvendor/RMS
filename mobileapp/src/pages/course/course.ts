import { Component, ViewChild, OnInit,TemplateRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { LoaderService } from '../../service';
import { Storage } from '@ionic/storage';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@IonicPage({
  name: 'course-page'
})
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
  providers: [Constant]

})
export class CoursePage implements OnInit {
  
  statusKey;
  noRecordsFoundMessage;
  currentUser;
  status;
  totalPage;
  search;
  signRequireCount;
  signRequireList;
  uploadPath;
  tab;
  className;
  showToastr;
  msgTitle;
  msgDes;
  assignedCount;
  modalRef: BsModalRef;
  assignedCoursesList = [];
  progressCoursesList = [];
  completeCoursesList = [];
  userInformation: any = [];
  userAssigned: any;
  userProgress: any;
  userCompleted: any;
  courseList: any = [];
  allCourses: any = [];
  paramsData = {};
  showSearchBar: boolean = false;
  scrollEnable: boolean = false;
  showAssigned: boolean = false;
  showProgress: boolean = true;
  showCompleted: boolean = true;
  showSignRequire: boolean = true;
  hideUploadContent: boolean = false;
  currentPage = this.constant.numbers.one;
  perPageData = this.constant.numbers.ten;
  
  @ViewChild(Content) content: Content;
  
  constructor(public navCtrl: NavController,public modalService:BsModalService ,public storage: Storage, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public loader: LoaderService) {
        let detailObj = this.navParams.data;
        this.tab = detailObj && detailObj.tab;
        this.status = detailObj && detailObj.status;
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
            let self = this;
            this.storage.get('RolePermissions').then((res:any) =>{
              if(res != "[]"){
                let data =JSON.parse(res);
                let obj = data.find(o => o.moduleName === 'Employee Content Upload');
                this.hideUploadContent = obj && obj['upload'] ? obj['upload'] : false;
              }  
            });
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
              this.status = this.status ? this.status : 'assigned';
              this.getCourseStatus(this.status, '');
              this.showData(this.status);
                if(this.tab && this.tab == 'signReq'){
                  this.getSignRequired('');
                }
            }
        });
  }


  successMessage(msg){
    this.showToastr = true;
    this.className = "notify-box alert alert-success";
    this.msgTitle = "Success";
    this.msgDes = msg ;
    let self = this;
    setTimeout(function(){ 
      self.showToastr = false;
      }, 3000); 
  }

  ionViewDidEnter() {
    this.assignedCoursesList = [];
    this.progressCoursesList = [];
    this.completeCoursesList = [];
    this.getCoursesList(); 
  }

   goToForum(){
     this.navCtrl.push('forum-page');
  }

  goToFailedList(){
    this.navCtrl.push('course-failed-page');
  }
  
  openTrainingClass(data) 
  {
    if(this.status == 'assigned'){
    let userId = this.currentUser ? this.currentUser.userId : 8;
        let postData={
        'userId' : userId,
        'status': "inProgress"
        }
        data.Course ? postData['courseId'] = data.courseId : postData['trainingClassId'] = data.trainingClassId;
        this.http.put(false,API_URL.URLS.updateTrainingStatus, postData).subscribe((res) => {      
        },(err) => {
          console.log(err);
        });
      }
      this.paramsData['courseId'] = data.courseId;
      this.paramsData['courseName'] = data.Course ? data.Course.courseName:'';
      this.paramsData['trainingScheduleId'] = data.TrainingSchedule.trainingScheduleId;
      this.paramsData['status'] = this.status;
   
      if(data.Course){   
        this.paramsData['typeSet'] = 'Course';
        this.navCtrl.push('training-page',this.paramsData);
      }else{
        this.paramsData['setData'] = {};
        this.paramsData['setData']['typeSet'] = 'Class';
        this.paramsData['trainingClassId'] = data.trainingClassId ? data.trainingClassId : '';
        this.navCtrl.push('trainingdetail-page', this.paramsData);
      }
    
  }

  openSignRequireDetail(Files, notificationFileId){
    let data = {
      'files' : Files,
      'uploadPath' : this.uploadPath,
      'type' : 'signReq',
      'notificationFileId' : notificationFileId
    }
    this.navCtrl.push('signrequire-page', data);
  }

  //getcourse 
  async getCoursesList(){
    this.loader.showLoader();
    await this.getCourse();
    this.loader.hideLoader();
  }


   //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.getCourseStatus(this.status,'');
            event.complete(); //To complete scrolling event.
        }, 1000);
    }
  
  getCourseStatus(status, search) {
    let self = this;
    this.courseList = [];
    return new Promise(resolve => {
      let userId = this.currentUser ? this.currentUser.userId : 8;
      let resortId = this.currentUser.ResortUserMappings[0].resortId;
      this.http.get(API_URL.URLS.trainingCourseAPI + '?status=' + status + '&userId=' + userId +'&resortId='+resortId+'&page='+this.currentPage+'&size='+this.perPageData+'&search=' +search).subscribe((res) => {
        if(res['data']['rows']){
          this.assignedCount = res['data']['count'];
          this.totalPage = this.assignedCount / this.perPageData;
          if (this.scrollEnable) {
              for (let i = 0; i < res['data']['rows'].length; i++) {
                  this.courseList.push(res['data']['rows'][i]);
              }
          } else {
              this.courseList = res['data']['rows'];
          }
        }else{
          this.assignedCount = 0;
          self.noRecordsFoundMessage = res['message'];
        }
        resolve('resolved');
      },(err) => {
        resolve('rejected');
      });
    });
  }

  getSignRequired(search){    
    this.showAssigned = true;
    this.showProgress = true;
    this.showCompleted = true;
    this.showSignRequire = false;
    let userId =  this.currentUser.userId;
    let resortId = this.currentUser.ResortUserMappings[0].resortId;
    let status='signRequired';
    this.http.get(API_URL.URLS.signRequired+'?userId=' +userId+'&resortId='+resortId+'&status='+status+'&search='+search+'&mobile='+1).subscribe(res=>{
    if(res['data']['rows'].length){
      this.signRequireList =res['data']['rows'];
      this.signRequireCount = res['data']['count'];
      this.uploadPath =res.data.uploadPath.uploadPath;
    }else{
      this.signRequireCount = 0;
      this.noRecordsFoundMessage = res['message'];
    }
    })
  }

   toggleSearchBox() {
    this.showSearchBar = !this.showSearchBar;
   }


   onInput($e) {
    if (this.search && this.showSignRequire) {
      this.getCourseStatus(this.status, this.search)
    }else if(this.search && !this.showSignRequire){
      this.getSignRequired(this.search)
    } else {
      //this.showSearchBar = false;
      this.getCourseStatus(this.status, '');
    }
  }
  
  //Close and empty search bar
  onCancel($e) {
    //this.showSearchBar = false;
    this.search="";
    this.getCourseStatus(this.status, '');
  }




  getCourse() {
    return new Promise(resolve => {
      this.http.getData(API_URL.URLS.getCourse).subscribe((data) => {
        this.allCourses = data;
        var self = this;
        this.allCourses.assigned.map(function (value, key) {
          //value['expireDate']=self.calculateExpireDays(value.dueDate);
          self.assignedCoursesList.push(value);          
        });
        this.allCourses.inprogress.map(function (value, key) {
         // value['expireDate']=self.calculateExpireDays(value.dueDate);
          self.progressCoursesList.push(value);
        });
        this.allCourses.completed.map(function (value, key) {
          self.completeCoursesList.push(value);
        });        
        resolve('resolved');
      }, (err) => {
        console.log('error occured', err);
        resolve('rejected');
      });
    });
  }

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



  openLaunchModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  launchApp(){
    let postData = {
      userId : this.currentUser.userId
    }
    this.http.post(false,API_URL.URLS.contentEmail,postData).subscribe(res=>{
      if(res['isSuccess']){
        this.successMessage(res['message']);
        this.modalRef.hide();
      }
    })
  }

  // show tabs
  showData(show) {
    this.showSearchBar = false;
    this.status = show;
    switch (show) {
      case 'assigned':
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
        this.showSignRequire = true;
        break;
      case 'inProgress':
        this.showAssigned = true;
        this.showProgress = false;
        this.showCompleted = true;
        this.showSignRequire = true;
        break;
      case 'completed':
        this.showAssigned = true;
        this.showProgress = true;
        this.showCompleted = false;
        this.showSignRequire = true;
        break;
      default:
        this.showAssigned = false;
        this.showProgress = true;
        this.showCompleted = true;
        this.showSignRequire = true;
    }

    this.getCourseStatus(show,'');

  }

 

}

