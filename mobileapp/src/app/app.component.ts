import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Storage } from '@ionic/storage';
import { Constant } from '../constants/Constant.var';
import { AuthProvider } from '../providers/auth/auth';
import { LandingPage, HomePage, TrainingPage, ForumPage, EventPage, CalendarPage, SettingsPage, ProfilePage, LibraryPage } from '../pages/indexComponent';
import { Calendar } from '@ionic-native/calendar';
import { API_URL } from '../constants/API_URLS.var';
import { HttpProvider } from '../providers/http/http';

@Component({
  templateUrl: 'app.html',
  providers: [AppVersion, Constant]
})
export class MyApp {
  @ViewChild(Nav) nav; Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;
  currentUser;
  windowWidth;
  profilePage = { title: 'Profile', component: ProfilePage };
  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthProvider, private appVersion: AppVersion, public storage: Storage, public constant: Constant, public app: App,public calendar:Calendar,public API_URL:API_URL,public http:HttpProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.getDetails();
    console.log('ionViewWillEnter behaviour');
    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // console.log('navigation activeView');
      // console.log(activeView);
      // console.log(activeView.name);
      // console.log(activeView.id);
      // console.log(nav.canGoBack());
      // console.log(this.nav.canGoBack());
      // Checks if can go back before show up the alert
      if (activeView.name === 'HomePage') {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        }
      } else if (activeView.name === 'TrainingPage') {

        console.log('in training page');
        this.nav.setRoot('home-page');
      }
      else if (activeView.name === 'ForumPage') {

        console.log('in forum page');
        this.nav.setRoot('training-page');
      }
      else if (activeView.name === 'AccomplishmentPage') {

        console.log('in AccomplishmentPage page');
        this.nav.setRoot('home-page');
      }
      else if (activeView.name === 'EventPage') {

        console.log('in EventPage page');
        this.nav.setRoot('forum-page');
      }
      else if (activeView.name === 'LibraryPage') {

        console.log('in LibraryPage page');
        this.nav.setRoot('event-page');
      }
      else if (activeView.name === 'SettingsPage') {
        console.log('in SettingsPage page');
        this.nav.setRoot('library-page');
      }
      else {
        console.log('back history');
        //this.nav.backHistory();
        // this.nav.pop({});
        this.nav.setRoot('home-page');
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
   
    this.windowWidth = window.screen.width;
  }
 
  openPage(page) {
    if(page.component === CalendarPage){
      this.platform.ready().then(() => {
        this.createCalendar();
      });
    }else{
      this.nav.setRoot(page.component);
    }
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
        } else {
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


  //Calendar Options Formations Functions 
  calendarIdUnique;
  calendars;
  openCalendar() {

    this.calendar.openCalendar(new Date()).then(
      (msg) => {
        console.log("open calendar");
        console.log(msg);
      },
      (err) => {
        console.log("open calendar error");
        console.log(err);
      }
    );
  }

  createCalendar() {

    var self = this;
    this.calendar.createCalendar('RMS Calendar').then(
      (msg) => {
        console.log("write permission");
        self.calendar.hasReadWritePermission().then(
          (res) => {
            console.log("RMS Calendar hasReadWritePermission", res);
            if (!res) {
              self.calendar.requestReadWritePermission().then(
                (resp) => {
                  console.log('Request requestReadWritePermission', resp);
                }
              );
            }
          },
          (err) => { console.log("RMS Calendar hasReadWritePermission error", err); }
        );
        console.log(this.calendar.hasReadWritePermission());
        console.log("write permission")

        this.calendarIdUnique = msg;
        self.openCalendar();
        self.getCalendars();
        console.log("RMS Calendar Created", msg);
      },
      (err) => { console.log("RMS Calendar Creation error", err); }
    );
  }

  deleteCalendar() {
    this.calendar.deleteCalendar('RMS Calendar').then(
      (msg) => { console.log("RMS Calendar Deleted", msg); },
      (err) => { console.log("RMS Calendar Deletion error", err); }
    );
  }
  getCalendars() {
    // var self= this;
    this.http.getData(API_URL.URLS.getCalendars).subscribe((data) => {
      if (data['isSuccess']) {
        this.calendars = data['calendarList'];
        this.loopCalendar(this.calendars);
        // this.calendars.map(function(value,key){
        //     self.addEventWithOptions(value);
        // });
      }
    });
  }
  loopCalendar(calendarArray) {
    var self = this;
    calendarArray.map(function (value, key) {
      self.addEventWithOptions(value).then(function (respCollect) {

        console.log('Total Response Collected here');
        console.log(respCollect);
      });
    });
  }
  addEventWithOptions(cal) {
    return new Promise((resolve, reject) => {
      //,firstReminderMinutes:15
      let options = { calendarId: cal.calendarId, calendarName: cal.calendarName, url: cal.url };
      var startDate = this.getDate(cal.startDate);
      var endDate = this.getDate(cal.endDate);
      var startDates = new Date(startDate['year'], startDate['month'], startDate['date'], 0, 0, 0, 0); // beware: month 0 = january, 11 = december
      var endDates = new Date(endDate['year'], endDate['month'], endDate['date'], 0, 0, 0, 0);
      console.log(cal);
      console.log("function call");

      console.log(options);
      console.log("function call options above one");
      // this.calendar.findEventWithOptions(cal.title, cal.location, cal.notes, startDates, endDates, options).then(resp => {
      // console.log("find event resp", startDates, endDates);

      console.log("function dates", startDates, endDates);
      console.log(cal.title, cal.location, cal.notes, startDates, endDates, options);
      // console.log(resp.length);
      // if (resp.length >= 0){
      this.calendar.createEventWithOptions(cal.title, cal.location, cal.notes, startDates, endDates, options).then(res => {
        console.log("create event resp", startDates, endDates);
        console.log("function hitting only once", cal);
        console.log(res);
        resolve(res);
      }, err => {
        reject(err);
        console.log('create err: ', err);
      });
      // }
      // }, err => {
      //   reject(err);
      //   console.log('find err: ', err);
      // });
    });
  }
  getDate(dateFormat) {
    let date = dateFormat.split('-');
    let resp = {};
    resp['year'] = date[0];
    resp['month'] = date[1] - 1;
    resp['date'] = date[2];
    return resp;
  }
}

