import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AuthProvider } from '../../providers/auth/auth';
import { Constant } from '../../constants/Constant.var';
import {ToastrService} from '../../service/toastrService';
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
    constructor(public navCtrl: NavController, public http: HttpProvider, public navParams: NavParams, private authService: AuthProvider, private alertCtrl: AlertController, public storage: Storage, public constant: Constant,private toastr:ToastrService) {
    }
    ngOnInit() {
        this.storage.get('userInput').then(
            (val) => {
                if (val) {
                    this.user = val
                }
                console.log(val);
            }, (err) => {
                console.log('userInput not received', err);
            });
    }
    doLogin() {
        if (this.user.keepmelogin) {
            this.storage.set('userInput', this.user).then(() => {
                console.log('Data has been set');
            });
        }
        this.authService.login(this.user.name, this.user.pw, this.user.keepmelogin).then(success => {
            if (success) {
                this.navCtrl.setRoot('home-page');
                this.toastr.success('Login Successful');
            }
        }).catch(err => {
            const alert = this.alertCtrl.create({
                title: 'Login Failed',
                subTitle: 'Please check login credentials',
                buttons: ['OK']
            });
            alert.present();
        });
    }
    goToSignUp() {
        this.navCtrl.setRoot('signup-page');
    }
    goToForget() {
        this.navCtrl.setRoot('forget-page');
    }
}