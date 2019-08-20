import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { API_URL } from '../../constants/API_URLS.var';
import { HttpProvider } from '../../providers/http/http';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
  name: 'forget-page'
})
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
  providers: [Constant]
})
export class ForgetPage implements OnInit {
  forgetform: FormGroup;
  forget = {
    "emailAddress": "",
    "phoneNumber": ""
  }
  className;
  showToastr=false;
  msgDes;
  msgTitle;

  constructor(public navCtrl: NavController,public http: HttpProvider,public navParams: NavParams, public constant: Constant) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    let MOBILEPATTERN = /^[0-9]{10,12}$/;
    this.forgetform = new FormGroup({
      phone: new FormControl('', [Validators.required,  Validators.pattern(MOBILEPATTERN)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }
  
  forgetfn() {
    let postData={
       emailAddress : this.forget.emailAddress ,
       phoneNumber : this.forget.phoneNumber
    }
    this.http.post(false,API_URL.URLS.forgetPassword, postData).subscribe((res) => {
      if(res['isSuccess']){
         this.navCtrl.setRoot('login-page');
         this.toastrMessage(res['message'], 'success');
      }else{
        this.toastrMessage(res['error'], 'error');
      }
    });
  }

  goBackLogin(){
    this.navCtrl.setRoot('login-page');
  }
  
   toastrMessage(msg,type){
    this.showToastr = true;
    this.className =type == 'success' ? "notify-box alert alert-success" : "notify-box alert alert-error";
    this.msgTitle =type == 'success' ? "Success" : "Error";
    this.msgDes = msg ;
    let self = this;
    setTimeout(function(){ 
      self.showToastr = false;
      }, 3000); 

  }

}
