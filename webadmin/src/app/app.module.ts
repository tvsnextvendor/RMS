import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataTableModule} from "angular-6-datatable";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoursesModule } from './courses/courses.module';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard.component';
import { QuizModule } from './quiz/quiz.module';
import { GroupModule } from './group/group.module';
import { ExcelService } from './services/excel.service';
import { PDFService } from './services/pdf.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SettingsModule } from './settings/settings.module';
import { VideosTrendModule } from './videostrend/videostrend.module';
import { EmployeeModule } from './employee/employee.module';
import { ProfileModule } from './profile/profile.module';
import { ForumModule } from './forum/forum.module';
import { moduleModule } from './module/module.module';
import { BatchModule } from './batch/batch.module';
import { CertificatesModule } from './certificates/certificates.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    moduleModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SelectDropDownModule,
    NgHttpLoaderModule.forRoot(),
    DashboardModule,
    CoursesModule,
    DataTableModule,
    QuizModule,
    CertificatesModule,
    BatchModule,
    MaterialModule,
    GroupModule,
    HttpClientModule,
    SharedModule,
    ForumModule,
    SettingsModule,
    VideosTrendModule,
    ProfileModule,
    FormsModule, 
    GroupModule,
    EmployeeModule,
    UserModule
  ],
  providers: [AuthGuard,ExcelService,PDFService],
  bootstrap: [AppComponent]
})
export class AppModule { }
