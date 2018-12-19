import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import {AuthGuard} from '../guard/auth.guard.component'
import {AddModuleComponent} from './add-module/add-module.component';
import {ModuleDetailsComponent} from './module-details/module-details.component';
import {ModuleListComponent} from './module-list/module-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { TabsModule } from 'ngx-bootstrap/tabs';
import {DndModule} from 'ng2-dnd';
import {AddQuizComponent} from './add-quiz/add-quiz.component';

const routes: Routes = [
    { path: 'module', component:AddModuleComponent ,canActivate : [AuthGuard]},
    { path: 'modulelist', component:ModuleListComponent ,canActivate : [AuthGuard]},
    { path:  'module/:moduleId', component:AddModuleComponent ,canActivate : [AuthGuard]}    
];

@NgModule({
  imports: [
    TagInputModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule.forRoot(),
    CarouselModule,
    NgHttpLoaderModule.forRoot(),
    TabsModule.forRoot(),
    DndModule.forRoot()
    ],
  declarations: [
    AddModuleComponent,
    ModuleListComponent,
    ModuleDetailsComponent,
    AddQuizComponent
  ],
  bootstrap: [AddModuleComponent]
})
export class moduleModule { }
