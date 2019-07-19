import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Constant } from '../constants/Constant.var';
import { AuthProvider } from '../providers/auth/auth';
import { LandingPage, HomePage, ForumPage, EventPage, CalendarPage, SettingsPage, ProfilePage, CoursePage,AccomplishmentPage,FeedbackPage } from '../pages/indexComponent';
import { Calendar } from '@ionic-native/calendar';
import { API_URL } from '../constants/API_URLS.var';
import { HttpProvider } from '../providers/http/http';
import { ToastController } from 'ionic-angular';
import { Location } from "@angular/common";




@Component({
  templateUrl: 'app.html',
  providers: [AppVersion, Constant]
})
export class MyApp implements OnInit{

  @ViewChild(Nav) nav; Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  currentUser;
  uploadPath;
  userImage;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  windowWidth;
  profilePage = { title: 'Profile', component: ProfilePage };

  constructor(private location: Location,public toastCtrl:ToastController,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, public appVersion: AppVersion, public storage: Storage, public constant: Constant, public app: App,public calendar:Calendar,public API_URL:API_URL,public http:HttpProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      if (activeView.component.name == "HomePage") {
          //Double check to exit app                  
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
              navigator['app'].exitApp(); // work for ionic 4
          } else {
              let toast = this.toastCtrl.create({
                  message: 'Press back again to exit App',
                  duration: 3000,
                  position: 'bottom'
              });
              toast.present();
              this.lastTimeBackPress = new Date().getTime();
          }
      } else{
        console.log("YAYYYYYY");
        //this.location.back();
        //this.nav.pop();
        this.nav.setRoot('home-page');
        }
    });

    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: CoursePage },
      { title: 'Forum', component: ForumPage },
      { title:'Accomplishments', component: AccomplishmentPage},
      { title: 'Training Schedule', component: EventPage },
      { title: 'Feedback', component: FeedbackPage },
      { title: 'Settings', component: SettingsPage }
    ];
    this.windowWidth = window.screen.width;
  }



  openPage(page) {
    // if(page.component === CalendarPage){
    //   this.platform.ready().then(() => {
    //     this.createCalendar();
    //   });
    // }else{
      this.nav.setRoot(page.component);
   // }
  }

  ngOnInit(){
    this.getDetails();
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
         // debugger;
          self.currentUser = val;
        //  self.uploadPath= this.currentUser['uploadPaths']['uploadPath'];
          self.userImage = this.currentUser.userImage;
          console.log(this.currentUser,"CURRENTUSER");
          console.log(this.uploadPath)
          this.rootPage = HomePage;
        } else {
          this.rootPage = LandingPage;
        }
        console.log(self.currentUser);
      }, (err) => {
        this.rootPage = LandingPage;
        console.log('currentUser not received in app.component.ts', err);
      });
  }
  
  appDetails() {
    // let appName = this.appVersion.getAppName();
    // let packageName = this.appVersion.getPackageName();
    // let versionCode = this.appVersion.getVersionCode();
    // let versionNumber = this.appVersion.getVersionNumber();
    // console.log(appName);
    // console.log(packageName);
    // console.log(versionCode);
    // console.log(versionNumber);
  }

 
}

