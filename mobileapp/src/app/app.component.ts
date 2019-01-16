import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Constant } from '../constants/Constant.var';
import { AuthProvider } from '../providers/auth/auth';
import { LandingPage, HomePage, TrainingPage, ForumPage, EventPage, CalendarPage, SettingsPage, ProfilePage,LibraryPage } from '../pages/indexComponent';


@Component({
  templateUrl: 'app.html',
  providers: [AppVersion, Constant]
})
export class MyApp{
  @ViewChild(Nav) nav; Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  currentUser;
  windowWidth;
  profilePage = { title: 'Profile', component: ProfilePage };
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, private appVersion: AppVersion, public storage: Storage, public constant: Constant,public app: App) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.getDetails();
    // platform.registerBackButtonAction(() => {
    //  // let nav = this.app.getActiveNavs()[0];
    //   if (this.nav.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
    //     this.nav.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
    //   } else {
    //     platform.exitApp(); // IF IT'S THE ROOT, EXIT THE APP.
    //   }
    // });
    platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];

      console.log(nav);
      let activeView = nav.getActive();       
      // Checks if can go back before show up the alert
      if(activeView.name === 'HomePage') {
          if (nav.canGoBack()){
              nav.pop();
          } else {
              // const alert = this.alertCtrl.create({
              //     title: 'Fechar o App',
              //     message: 'Você tem certeza?',
              //     buttons: [{
              //         text: 'Cancelar',
              //         role: 'cancel',
              //         handler: () => {
              //           this.nav.setRoot('HomePage');
              //           console.log('** Saída do App Cancelada! **');
              //         }
              //     },{
              //         text: 'Fechar o App',
              //         handler: () => {
              //           this.logout();
              //           this.platform.exitApp();
              //         }
              //     }]
              // });                                                                                                                      
              // alert.present();
          }
      }
  });
    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: TrainingPage },
      { title: 'Forum', component: ForumPage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Training Schedule', component: EventPage },
      { title: 'Library', component: LibraryPage },
      { title: 'Settings', component: SettingsPage }
    ];
  //  this.appDetails();
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
          self.currentUser = val;
          this.rootPage = HomePage;
        }else{
          this.rootPage = LandingPage;
        }
        console.log(self.currentUser);
        console.log('self.currentUser');
      }, (err) => {
        this.rootPage = LandingPage;
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

