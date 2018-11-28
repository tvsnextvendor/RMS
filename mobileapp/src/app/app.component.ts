import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TrainingPage } from '../pages/training/training';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav; Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
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











}

