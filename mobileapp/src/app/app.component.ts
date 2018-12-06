import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TrainingPage } from '../pages/training/training';
import { LoginPage } from '../pages/login/login';
import { ForumPage } from '../pages/forum/forum';
import { ProfilePage } from '../pages/profile/profile';
import { CalendarPage } from '../pages/calendar/calendar';
import { SettingsPage } from '../pages/settings/settings';
import { AuthProvider } from '../providers/auth/auth';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  templateUrl: 'app.html',
  providers:[AppVersion]
})
export class MyApp {

  @ViewChild(Nav) nav; Nav;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any }>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, private appVersion: AppVersion) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: TrainingPage },
      { title: 'Forum', component: ForumPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Settings', component: SettingsPage }
    ];
    this.appDetails();
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  logOut() {
    this.authService.logout();
    this.nav.setRoot('login-page');
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

