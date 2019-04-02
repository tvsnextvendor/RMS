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
import { TabsModule } from 'ngx-bootstrap/tabs';
import {DndModule} from 'ng2-dnd';
import { BatchModule } from '../batch/batch.module';
import {AddQuizComponent} from './add-quiz/add-quiz.component';


const routes: Routes = [
    { path: 'module', component:AddModuleComponent ,canActivate : [AuthGuard]},
    { path: 'courselist', component:CourseListComponent ,canActivate : [AuthGuard]},
    { path: 'modulelist/:id', component:ModuleListComponent ,canActivate : [AuthGuard]},
    { path:  'module/:moduleId', component:AddModuleComponent ,canActivate : [AuthGuard]} ,
    { path:  'modules/:moduleId/:courseId', component:ModuleDetailsComponent ,canActivate : [AuthGuard]}, 
    { path:  'modules', component:ModuleDetailsComponent ,canActivate : [AuthGuard]}          
];

@NgModule({
  imports: [
    TagInputModule,
    BrowserModule,
    FormsModule,
    DataTableModule,
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule.forRoot(),
    CarouselModule,
    BatchModule,
    // NgHttpLoaderModule.forRoot(),
    TabsModule.forRoot(),
    DndModule.forRoot()
    ],
  declarations: [
    AddModuleComponent,
    CourseListComponent,
    ModuleListComponent,
    ModuleDetailsComponent,
    AddQuizComponent
  ],
  bootstrap: [AddModuleComponent]
})
export class moduleModule { }
