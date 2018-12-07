import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { HttpClientModule } from '@angular/common/http';
import { SignupPageModule } from '../pages/signup/signup.module';
import { LoginPageModule } from '../pages/login/login.module';
import { ForgetPageModule } from '../pages/forget/forget.module';
import { HomePageModule } from '../pages/home/home.module';
import { TrainingPageModule } from '../pages/training/training.module';
import { TrainingDetailPageModule } from '../pages/training-detail/training-detail.module';
import { QuizPageModule } from '../pages/quiz/quiz.module';
import { QuizResultModule } from '../pages/quiz-result/quiz-result.module';
import { ForumPageModule } from '../pages/forum/forum.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { CalendarPageModule } from '../pages/calendar/calendar.module';

import { API } from '../constants/API.var';
import { API_URL } from '../constants/API_URLS.var';
import { MyApp } from './app.component';
import { HttpProvider } from '../providers/http/http';
import { AuthProvider } from '../providers/auth/auth';

import { GooglePlus } from '@ionic-native/google-plus';
import { LinkedIn } from '@ionic-native/linkedin';


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
    CalendarPageModule

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
