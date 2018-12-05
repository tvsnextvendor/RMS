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
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard.component';
import {QuizModule} from './quiz/quiz.module';
import { ExcelService } from './services/excel.service';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { EmployeestatusComponent } from './employeestatus/employeestatus.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetpasswordComponent,
    EmployeestatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    DashboardModule,
    VideoModule,
    DataTableModule,
    QuizModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    FormsModule, 
    
  ],
  providers: [AuthGuard,ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
