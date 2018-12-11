import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import {ForumComponent} from './forum.component';
import {CreateForumComponent} from './createForum/createForum.component';
import {DataTableModule} from "angular-6-datatable";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule} from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 



const routes: Routes = [
    { path: 'forum', component:ForumComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    DataTableModule,
    FormsModule,
    TagInputModule,
    SelectDropDownModule
    ],
  declarations: [
    ForumComponent,CreateForumComponent
  ],
  bootstrap: [ForumComponent]
})
export class ForumModule { }
