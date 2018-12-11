import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import * as $ from 'jquery';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {DataTableModule} from "angular-6-datatable";
import { DashboardModule } from './dashboard/dashboard.module';
import { VideoModule } from './video/video.module';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { FormsModule }   from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard.component';
import {QuizModule} from './quiz/quiz.module';
import {GroupModule} from './group/group.module';
import { ExcelService } from './services/excel.service';
import { PDFService } from './services/pdf.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { EmployeestatusComponent } from './employeestatus/employeestatus.component';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';
import {SettingsModule} from './settings/settings.module';
import {VideosTrendModule} from './videostrend/videostrend.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetpasswordComponent,
    EmployeestatusComponent,
    EmployeedetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SelectDropDownModule,
    DashboardModule,
    VideoModule,
    DataTableModule,
    QuizModule,
    MaterialModule,
    GroupModule,
    HttpClientModule,
    SharedModule,
    SettingsModule,
    VideosTrendModule,
    FormsModule, 
    GroupModule,
  ],
  providers: [AuthGuard,ExcelService,PDFService],
  bootstrap: [AppComponent]
})
export class AppModule { }
