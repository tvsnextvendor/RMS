import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import {ForumComponent} from './forum.component';
import {CreateForumComponent} from './createForum/createForum.component';
import {DataTableModule} from "angular-6-datatable";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule} from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForumDetailComponent } from './forum-detail/forum-detail.component'; 



const routes: Routes = [
    { path: 'forum', component:ForumComponent ,canActivate : [AuthGuard]},
    { path: 'forumdetail', component:ForumDetailComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    DataTableModule,
    FormsModule,
    TagInputModule,
    NgHttpLoaderModule.forRoot(),
    SelectDropDownModule
    ],
  declarations: [
    ForumComponent,CreateForumComponent, ForumDetailComponent
  ],
  bootstrap: [ForumComponent]
})
export class ForumModule { }
