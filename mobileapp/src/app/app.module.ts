import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { GooglePlus } from '@ionic-native/google-plus';
import { LinkedIn } from '@ionic-native/linkedin';

import { AccomplishmentPageModule, CalendarPageModule, EventPageModule, ForgetPageModule, ForumPageModule, HomePageModule, LandingPageModule, LoginPageModule, ProfilePageModule, QuizPageModule, QuizResultModule, SettingsPageModule, SignupPageModule, TrainingPageModule, TrainingDetailPageModule } from '../pages';

import { API } from '../constants/API.var';
import { API_URL } from '../constants/API_URLS.var';
import { MyApp } from './app.component';
import { HttpProvider } from '../providers/http/http';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(
      // {name: '__mydb',driverOrder: ['indexeddb', 'sqlite', 'websql']}
    ),
    SignupPageModule,
    LoginPageModule,
    ForgetPageModule,
    HomePageModule,
    TrainingPageModule,
    TrainingDetailPageModule,
    QuizPageModule,
    QuizResultModule,
    ForumPageModule,
    SettingsPageModule,
    ProfilePageModule,
    CalendarPageModule,
    LandingPageModule,
    AccomplishmentPageModule,
    EventPageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    API,
    API_URL,
    HttpProvider,
    AuthProvider,
    GooglePlus,
    LinkedIn
  ]
})
export class AppModule { }
