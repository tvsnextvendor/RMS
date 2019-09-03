import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constant } from '../../constants/Constant.var';
import { AuthProvider } from '../../providers/auth/auth';


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

  constructor(public navCtrl: NavController,public authService: AuthProvider,public navParams: NavParams, public constant: Constant) {
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
    let postData = {
        emailAddress: this.forget.emailAddress,
        phoneNumber: this.forget.phoneNumber
    } 
   this.authService.forgetPassword(postData).subscribe(res => {
        if(res['isSuccess']) {
           this.toastrMessage(res['message'], 'success');      
       } else {
         this.toastrMessage(res['error'], 'error');
       }
   }, error => {
       console.log(error, "ERROR");
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
      self.navCtrl.push('login-page');  
      }, 3000); 

  }

}
