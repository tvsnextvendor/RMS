import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AuthProvider } from '../../providers/auth/auth';
import { Constant } from '../../constants/Constant.var';
import { Storage } from '@ionic/storage';
import { API } from '../../constants/API.var';


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
    appVersion;

    constructor(public navCtrl: NavController ,public http: HttpProvider, public navParams: NavParams, private authService: AuthProvider, public storage: Storage, public constant: Constant) {
      this.appVersion =  API.APP_VER;
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
        this.authService.login(this.user.name, this.user.pw, this.user.keepmelogin).subscribe(success => {
          console.log(success,"Success");
            if(success) {
                        this.navCtrl.push('home-page');
                }else{
                this.logincredentialerror = "Please check login credentials"; return false;
            }
        },error => {
            console.log(error, "ERROR");
            this.logincredentialerror = error.error; return false;
        });
    }
    goToSignUp() {
        this.navCtrl.push('signup-page');
    }
    goToForget() {
        this.navCtrl.push('forget-page');
    }
    goBackLogin(){
        this.navCtrl.push('login-page');
      }

  
}