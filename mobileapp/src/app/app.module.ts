import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { LinkedIn } from '@ionic-native/linkedin';
import { Calendar } from '@ionic-native/calendar';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { AccomplishmentPageModule, CalendarPageModule,TopicPageModule,EventPageModule, ForgetPageModule, ForumPageModule, HomePageModule, LandingPageModule, LoginPageModule, ProfilePageModule, QuizPageModule, QuizResultModule, SettingsPageModule, SignupPageModule, TrainingPageModule, TrainingDetailPageModule, NotificationPageModule, ForumDetailPageModule ,ModalPageModule,LibraryPageModule, CoursePageModule, FeedbackPageModule, GeneralNotificationPageModule, PopoverPageModule} from '../pages';
import { API } from '../constants/API.var';
import { API_URL } from '../constants/API_URLS.var';
import { MyApp } from './app.component';
import { HttpProvider } from '../providers/http/http';
import { AuthProvider } from '../providers/auth/auth';
import { LoaderService,DataService,ToastrService, SocketService, CommonService,SanitizeHtmlPipe,NetworkProvider } from '../service';
import { NgCalendarModule } from 'ionic2-calendar';
import { Network } from '@ionic-native/network';



@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(
      // {name: '__mydb',driverOrder: ['indexeddb', 'sqlite', 'websql']}
    ),
    SignupPageModule,
    LoginPageModule,
    ForgetPageModule,
    TopicPageModule,
    HomePageModule,
    TrainingPageModule,
    TrainingDetailPageModule,
    QuizPageModule,
    QuizResultModule,
    ForumPageModule,
    GeneralNotificationPageModule,
    SettingsPageModule,
    ProfilePageModule,
    CalendarPageModule,
    LandingPageModule,
    AccomplishmentPageModule,
    EventPageModule,
    NotificationPageModule,
    ModalPageModule,
    ForumDetailPageModule,
    LibraryPageModule,
    CoursePageModule,
    FeedbackPageModule,
    PopoverPageModule

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
    NetworkProvider,
    Network,
    LoaderService,
    ToastrService,
    DataService,
    SocketService,
    CommonService,
    GooglePlus,
    LinkedIn,
    Calendar,
    DocumentViewer,
    SanitizeHtmlPipe
  ]
})
export class AppModule { }
