import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { GroupComponent } from './group.component';
import { RouterModule, Routes } from '@angular/router';
import {DataTableModule} from "angular-6-datatable";
import {AuthGuard} from '../guard/auth.guard.component';
import { TagInputModule } from 'ngx-chips';


const routes: Routes = [
    { path: 'groups', component: GroupComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    DataTableModule,
    FormsModule,
    SelectDropDownModule,
    TagInputModule,
    RouterModule.forRoot(routes),
    ],
  declarations: [
    GroupComponent
  ],
  bootstrap: [GroupComponent]
})
export class GroupModule { }
