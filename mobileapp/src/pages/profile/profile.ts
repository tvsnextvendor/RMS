import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Constant } from '../../constants/Constant.var';
import { API_URL } from '../../constants/API_URLS.var';
import { HttpProvider } from '../../providers/http/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../service/toastrService';


@IonicPage({
  name: 'profile-page'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [Constant]
})
export class ProfilePage implements OnInit {
  currentUser;
  profileDetail;
  profileForm: FormGroup;
  profile = {
    'userName' : '',
    'mobile':'',
    'email':''
  }

  constructor(public navCtrl: NavController,public http: HttpProvider
  ,public navParams: NavParams, public toastr: ToastrService,public storage: Storage, public constant: Constant) {
  }

  ionViewDidLoad() {    
  }
  
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
     this.profileForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
    this.getDetails();
  }

  getDetails() {
    let self = this;
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          self.currentUser = val;
          this.getUserProfile();
        }
      }, (err) => {
        console.log('currentUser not received in profile.component.ts', err);
      });    
  }

  getUserProfile(){
    let userId = this.currentUser.userId;
    console.log(API_URL.URLS.getProfile+'?userId=');
    this.http.get(API_URL.URLS.getProfile+'?userId='+userId).subscribe((res)=>{
       if(res['isSuccess']){
         this.profileDetail = res['data']['rows'][0];
         this.profile.userName = this.profileDetail.userName;
         this.profile.mobile = this.profileDetail.phoneNumber;
         this.profile.email = this.profileDetail.email;
       }
    })
  }

  updateProfile(){
    let userId = this.currentUser.userId;
    let postData = {
      "userName": this.profile.userName,
      "email":this.profile.email,
      "phoneNumber":this.profile.mobile
    }
    this.http.put(false,API_URL.URLS.updateProfile+userId, postData).subscribe((res)=>{
      if(res['isSuccess']){
        this.toastr.success(res['result']);
        this.navCtrl.setRoot('home-page');
      }
    })
  }



  goToProfile() {
    this.navCtrl.setRoot('profile-page');
  }
  goToPrevious(){
    this.navCtrl.setRoot('home-page');
  }


}
