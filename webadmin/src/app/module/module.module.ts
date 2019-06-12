import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import "angular2-navigate-with-data";
import { TagInputModule } from 'ngx-chips';
import {DataTableModule} from "angular-6-datatable";
import {AuthGuard} from '../guard/auth.guard.component';
import {AddModuleComponent} from './add-module/add-module.component';
import {ModuleDetailsComponent} from './module-details/module-details.component';
import {ModuleListComponent} from './module-list/module-list.component';
import {CourseListComponent} from './course-list/course-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap';
import {DndModule} from 'ng2-dnd';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule,OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { BatchModule } from '../batch/batch.module';
import {AddQuizComponent} from './add-quiz/add-quiz.component';
import {AddNotificationComponent} from './add-notofication/add-notification.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {UploadQuizComponent} from './upload-quiz/upload-quiz.component';
import {QuizService} from './quiz.service';

const routes: Routes = [
    { path: 'module', component:AddModuleComponent ,canActivate : [AuthGuard]},
    { path: 'courselist', component:CourseListComponent ,canActivate : [AuthGuard]},
    { path: 'modulelist/:id', component:ModuleListComponent ,canActivate : [AuthGuard]},
    { path:  'module/:moduleId', component:AddModuleComponent ,canActivate : [AuthGuard]} ,
    { path:  'modules/:moduleId/:courseId', component:ModuleDetailsComponent ,canActivate : [AuthGuard]}, 
    { path:  'modules', component:ModuleDetailsComponent ,canActivate : [AuthGuard]},
    { path: 'uploadQuiz', component:UploadQuizComponent, canActivate:[AuthGuard]}       
];
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'ddd D MMM YYYY LT',
  datePickerInput: 'D MMM YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    TagInputModule,
    BsDropdownModule.forRoot(),
    BrowserModule,
    FormsModule,
    DataTableModule,
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule.forRoot(),
    CarouselModule,
    BatchModule,
    // NgHttpLoaderModule.forRoot(),
    TabsModule.forRoot(),
    DndModule.forRoot(),
    BsDatepickerModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    DlDateTimePickerDateModule,
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ],
  declarations: [
    AddModuleComponent,
    CourseListComponent,
    ModuleListComponent,
    ModuleDetailsComponent,
    AddQuizComponent,
    UploadQuizComponent,
    AddNotificationComponent
  ],
  providers: [QuizService,
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
 ],
  bootstrap: [AddModuleComponent],
  exports:[AddModuleComponent,AddNotificationComponent,UploadQuizComponent]
})
export class moduleModule { }
