import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import {SocketService} from '../../service';

@IonicPage({
  name: 'feedback-page'
})
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
  providers: [Constant]
})
export class FeedbackPage {
    @ViewChild(Content) content: Content;

  goodActive=false;
  avgActive=false;
  poorActive=false;
  type;
  status= false;
  feedBack;
  errorMessage;
  currentUser;
  className;
  showToastr=false;
  msgTitle;
  msgDes;
  notificationCount;

  constructor(public navCtrl: NavController,public socketService:SocketService,public constant: Constant,public storage:Storage,public http:HttpProvider,public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getDetails();
  }

  getDetails() {
    let self = this;
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          self.currentUser = val;
          this.getNotification();
        }
      }, (err) => {
        console.log('currentUser not received in profile.component.ts', err);
      });    
  }

  goToNotification() {
    this.navCtrl.setRoot('notification-page');
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

selectSmiley(type, status){
  this.type=type;
  this.status=status;
  switch(type){
    case 'Compliment':
      this.goodActive = status;
      this.avgActive = false;
      this.poorActive = false;
      break;
    case  'Suggestion' :
      this.avgActive = status;
      this.goodActive = false;
      this.poorActive = false;
      break;
    case 'Complaint' :
      this.poorActive = status;
      this.avgActive = false;
      this.goodActive = false;
      
  }
}

saveFeedback(){
  if(!this.status){
       this.errorMessage = "Please select Feedback Type";
  }else if(!this.feedBack){
       this.errorMessage = "Please provide Feedback";
  }else{
    this.errorMessage="";
    let postData={
      feedback:this.feedBack,
      feedbackType: this.type,
      userId: this.currentUser.userId,
      resortId: this.currentUser.ResortUserMappings[0].resortId
    }
  this.http.post(false,API_URL.URLS.appFeedback,postData).subscribe(res=>{
      if(res['isSuccess']){
       this.content.scrollToTop();
       this.resetForm();
        this.showToastr=true;
        this.className = "notify-box alert alert-success";
        this.msgTitle = "Success";
        this.msgDes=res['message'];
        let self = this;
          setTimeout(function(){ 
          self.navCtrl.setRoot('home-page');
          }, 3000); 
      }
  })
  }
}

  resetForm(){
      this.goodActive = false;
      this.poorActive = false;
      this.avgActive = false;
      this.feedBack="";
      this.errorMessage="";
  }
  


}
