import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav,Platform, App, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Constant } from '../constants/Constant.var';
import { AuthProvider } from '../providers/auth/auth';
import { LandingPage, HomePage, EventPage, SettingsPage, ProfilePage, CoursePage,AccomplishmentPage,FeedbackPage,QuizResultPage } from '../pages/indexComponent';
import { Calendar } from '@ionic-native/calendar';
import { API_URL } from '../constants/API_URLS.var';
import { HttpProvider } from '../providers/http/http';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import {DataService, NetworkProvider} from "../service";



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
  showSideBar: boolean = true;
  profilePage = { title: 'Profile', component: ProfilePage };

  constructor(public toastCtrl:ToastController,private alertCtrl: AlertController,public dataService:DataService,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, public appVersion: AppVersion, public storage: Storage, public constant: Constant, public app: App,public calendar:Calendar,public API_URL:API_URL,public http:HttpProvider,public events: Events,public network: Network,public networkProvider: NetworkProvider) {
    
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.networkProvider.initializeNetworkEvents();
      
      // Offline event
      this.events.subscribe('network:offline', () => {
          alert('Please check your network connection');
      });
      
      // Online event
      this.events.subscribe('network:online', () => {
          alert('Network Connected');
      });
    });

    this.dataService.getLoginData.subscribe(res=>{
      console.log(res,"Res")
      if(res){
        console.log(res, "GOTIT");
        this.currentUser = res;
        this.uploadPath = this.currentUser['uploadPaths']['uploadPath'];
        this.userImage = this.currentUser.userImage;
        this.showSideBar = true;
      }else{
        console.log(res, "NOT GOTIT")
        this.getDetails();
      }
    })

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      let pageName = activeView.component.name;
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
      }else if(pageName == "QuizResultPage"){
        let alert = this.alertCtrl.create({
            message: 'The Quiz you have attended will be lost if you leave this page. Do you want to leave?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                      this.nav.setRoot('course-page')
                    }
                }
            ]
        });
        alert.present();
      }else if(pageName == "LandingPage"){
          navigator['app'].exitApp();
      }
      else if(pageName == "CoursePage" || pageName ==  "ForumPage" || pageName ==  "AccomplishmentPage" || pageName ==  "FeedbackPage" ||  pageName == "EventPage"){
        this.nav.setRoot('home-page');
      }else if(pageName == "LoginPage"){
        this.nav.setRoot('landing-page');
      }else{
         this.nav.pop();
        }
    });

    this.pages = [
      { title: 'Dashboard', component: HomePage },
      { title: 'Training', component: CoursePage },
      // { title: 'Forum', component: ForumPage },
      { title:'Accomplishments', component: AccomplishmentPage},
      { title: 'Training Schedule', component: EventPage },
      { title: 'Feedback', component: FeedbackPage },
      { title: 'Settings', component: SettingsPage }
    ];
    this.windowWidth = window.screen.width;
  }



  openPage(page) {
      this.nav.setRoot(page.component);
  }

  ngOnInit(){
  }

  getDetails() {
    let self = this;
    this.storage.get('currentUser').then(
      (val) => {
        if (val) {
          this.currentUser = val;
          this.uploadPath = this.currentUser['uploadPaths']['uploadPath'];
          this.userImage = this.currentUser.userImage;
          this.showSideBar = true;
          this.rootPage = HomePage;
        } else {
          this.showSideBar = false;
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

