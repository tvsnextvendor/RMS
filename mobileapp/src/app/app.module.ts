import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from '@angular/common/http';
import { TrainingPageModule } from '../pages/training/training.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { TrainingDetailPageModule } from '../pages/training-detail/training-detail.module';
import { QuizPageModule } from '../pages/quiz/quiz.module';
import { QuizResultModule } from '../pages/quiz-result/quiz-result.module';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpProvider } from '../providers/http/http';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TrainingPageModule,
    DashboardPageModule,
    TrainingDetailPageModule,
    QuizPageModule,
    QuizResultModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpProvider,
    AuthProvider
  ]
})
export class AppModule { }
