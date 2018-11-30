import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

@IonicPage({
    name: 'login-page'
})
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    user = {
        name: '',
        pw: ''
    }
    paramsObj: any = {};
    constructor(public navCtrl: NavController, public http: HttpProvider, public navParams: NavParams, private authService: AuthProvider, private alertCtrl: AlertController,public storage: Storage) {
    }
    doLogin() {
        this.authService.login(this.user.name, this.user.pw).then(success => {
            if (success) {
                this.navCtrl.setRoot('home-page');
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
}