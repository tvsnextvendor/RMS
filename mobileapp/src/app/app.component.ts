import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Constant } from '../constants/Constant.var';
import { AuthProvider } from '../providers/auth/auth';
import { LandingPage, HomePage, TrainingPage, ForumPage, EventPage, CalendarPage, SettingsPage, ProfilePage } from '../pages/indexComponent';

@Component({
  templateUrl: 'app.html',
  providers: [AppVersion, Constant]
})
export class MyApp {
  @ViewChild(Nav) nav; Nav;
  rootPage: any = LandingPage;
  pages: Array<{ title: string, component: any }>;
  currentUser;
  windowWidth;
  profilePage = { title: 'Profile', component: ProfilePage };
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, private appVersion: AppVersion, public storage: Storage, public constant: Constant) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: TrainingPage },
      { title: 'Forum', component: ForumPage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Events', component: EventPage },
      { title: 'Change Password', component: SettingsPage }
    ];
    this.appDetails();
    this.getDetails();
    this.windowWidth = window.screen.width;
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }
  logOut() {
    this.authService.logout();
    this.nav.setRoot('login-page');
  }
  getDetails() {
    let self = this;
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          self.currentUser = val
        }
        console.log(self.currentUser);
        console.log('self.currentUser');
      }, (err) => {
        console.log('currentUser not received in app.component.ts', err);
      });
  }
  appDetails() {
    let appName = this.appVersion.getAppName();
    let packageName = this.appVersion.getPackageName();
    let versionCode = this.appVersion.getVersionCode();
    let versionNumber = this.appVersion.getVersionNumber();
    console.log(appName);
    console.log(packageName);
    console.log(versionCode);
    console.log(versionNumber);
  }
}

