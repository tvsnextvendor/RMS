import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TrainingPage } from '../pages/training/training';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav; Nav;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen ,public authService:AuthProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: TrainingPage }
    ];
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  logOut(){
    this.authService.logout();
    this.nav.setRoot('login-page');
  }











}

