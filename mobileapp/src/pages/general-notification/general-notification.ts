import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ToastrService} from '../../service/toastrService';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Constant } from '../../constants/Constant.var';
import { LoaderService } from '../../service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';



@IonicPage({
    name: 'generalnotification-page'
})

@Component({
  selector: 'page-general-notification',
  templateUrl: 'general-notification.html',
})
export class GeneralNotificationPage {

 constructor(public navCtrl: NavController,public toastr: ToastrService,public storage: Storage, public navParams: NavParams, public constant: Constant, public http: HttpProvider, public loader: LoaderService) {
  }
 
 signRequireList;
 signRequireCount;
 uploadPath;
 noRecordsFoundMessage;
 currentUser;
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneralNotificationPage');
  }

    ngAfterViewInit() {
        let self = this;
        this.storage.get('currentUser').then((user: any) => {
        if (user) {
          self.currentUser = user;
          this.getSignRequired();
        }
    });
  }

getSignRequired(){
    let userId =  this.currentUser.userId;
    let resortId = this.currentUser.ResortUserMappings[0].resortId;
    let status = 'noSignRequired';
    this.loader.showLoader();
    this.http.get(API_URL.URLS.signRequired+'?userId=' +userId +'&resortId='+resortId+'&status='+status).subscribe(res=>{
    if(res['data']['rows']){
       this.loader.hideLoader();
      this.signRequireList =res['data']['rows'];
      this.signRequireCount = res['data']['count'];
      this.uploadPath = res['data']['uploadPath']['uploadPath'];
    }else{
      this.signRequireCount = 0;
      this.noRecordsFoundMessage = res['message'];
    }
    })
  }

  calculateExpireDays(dueDate) {
    const a = moment(new Date());
    const b = moment(new Date(dueDate));
    return a.to(b, true);
  }

  goBack(){
      this.navCtrl.setRoot('home-page');
  }

  openSignRequireDetail(Files, notificationFileId){
    let data = {
      'files' : Files,
      'uploadPath' : this.uploadPath,
      'type': 'noSignReq',
      'notificationFileId': notificationFileId
    }
    console.log(this.uploadPath);
    this.navCtrl.setRoot('signrequire-page', data);
  }
  
}
