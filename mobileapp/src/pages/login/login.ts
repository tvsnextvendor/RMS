import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AuthProvider } from '../../providers/auth/auth';
import { Constant } from '../../constants/Constant.var';
import { Storage } from '@ionic/storage';

@IonicPage({
    name: 'login-page'
})
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [Constant]
})
export class LoginPage implements OnInit {
    user = {
        name: '',
        pw: '',
        keepmelogin: false,
    }
    paramsObj: any = {};
    logincredentialerror;
    constructor(public navCtrl: NavController, public http: HttpProvider, public navParams: NavParams, private authService: AuthProvider, public storage: Storage, public constant: Constant) {
        //,private toastr:ToastrService
    }
    ngOnInit() {
        this.storage.get('userInput').then(
            (val) => {
                if (val) {
                    this.user = val
                }
            }, (err) => {
                console.log('userInput not received', err);
            });
            
    }
    doLogin() {

        if(!this.user.name || !this.user.pw){
           this.logincredentialerror = "Email ID & Password Can't Be Blank"; return false;
        }
        if (this.user.keepmelogin) {
            this.storage.set('userInput', this.user).then(() => {
            });
        }
        this.authService.login(this.user.name, this.user.pw, this.user.keepmelogin).then(success => {

            if(success) {
                this.storage.get('currentUser').then((user: any) => {
                    if(user){
                        this.navCtrl.setRoot('home-page');
                    }
                })
               //this.toastr.success('Login Successful');
            }else{
                this.logincredentialerror = "Please check login credentials"; return false;
                //this.logincredentialerror = this.authService.loginEmailError ? this.authService.loginEmailError  : this.authService.loginPassErr ;
            }
        }).catch(err => {
            console.log(err);
            this.logincredentialerror = "Please check login credentials"; return false;
            // this.toastr.error("Please check login credentials"); return false;
            // const alert = this.alertCtrl.create({
            //     title: 'Login Failed',
            //     subTitle: 'Please check login credentials',
            //     buttons: ['OK']
            // });
            // alert.present();
        });
    }
    goToSignUp() {
        this.navCtrl.setRoot('signup-page');
    }
    goToForget() {
        this.navCtrl.setRoot('forget-page');
    }
    goBackLogin(){
        this.navCtrl.setRoot('login-page');
      }

  
}