import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { HttpClientModule } from '@angular/common/http';
import { LoginPageModule } from '../pages/login/login.module';
import { HomePageModule } from '../pages/home/home.module';
import { TrainingPageModule } from '../pages/training/training.module';
import { TrainingDetailPageModule } from '../pages/training-detail/training-detail.module';
import { QuizPageModule } from '../pages/quiz/quiz.module';
import { QuizResultModule } from '../pages/quiz-result/quiz-result.module';

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
    IonicStorageModule.forRoot(),
    LoginPageModule,
    HomePageModule,
    TrainingPageModule,
    TrainingDetailPageModule,
    QuizPageModule,
    QuizResultModule
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
    AuthProvider
  ]
})
export class AppModule { }
