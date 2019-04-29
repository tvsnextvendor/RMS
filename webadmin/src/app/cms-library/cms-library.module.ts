import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard.component';
import { CMSLibraryComponent } from './cms-library.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {DndModule} from 'ng2-dnd';
import { ModalModule } from 'ngx-bootstrap';
import { BatchModule } from '../batch/batch.module';
import { CourseTabComponent } from './course-tab/course-tab.component';
import { TraingClassTabComponent } from './traing-class-tab/traing-class-tab.component';
import { VideoTabComponent } from './video-tab/video-tab.component';
import { DocumentTabComponent } from './document-tab/document-tab.component';
import { NotificationTabComponent } from './notification-tab/notification-tab.component';
import { QuizTabComponent } from './quiz-tab/quiz-tab.component';
import { RecentDeleteTabComponent } from './recent-delete-tab/recent-delete-tab.component';
import { FilterTabComponent } from './filter-tab/filter-tab.component';
import { EmployeesListComponent } from './course-tab/employees-list/employees-list.component';
import { EmployeeComponent } from './course-tab/employee/employee.component';
import { ContentFileComponent } from './course-tab/content-file/content-file.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


const routes: Routes = [
    { path: 'cms-library', component:  CMSLibraryComponent ,canActivate : [AuthGuard]},
    { path: 'employeeslist', component:  EmployeesListComponent ,canActivate : [AuthGuard]},
    { path: 'employee', component:  EmployeeComponent ,canActivate : [AuthGuard]},
    { path: 'contentfile', component:  ContentFileComponent ,canActivate : [AuthGuard]},
   
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
    BrowserModule, 
    FormsModule,  
    RouterModule.forRoot(routes),
    TooltipModule.forRoot(),
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    DndModule,
    ModalModule,
    BatchModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [
    CMSLibraryComponent, 
    CourseTabComponent,
    TraingClassTabComponent, 
    VideoTabComponent, 
    DocumentTabComponent, 
    NotificationTabComponent, 
    QuizTabComponent, 
    RecentDeleteTabComponent,
    FilterTabComponent, 
    EmployeesListComponent, 
    EmployeeComponent,
    ContentFileComponent
  ],
  bootstrap: [CMSLibraryComponent]
})
export class CMSLibraryModule { }
