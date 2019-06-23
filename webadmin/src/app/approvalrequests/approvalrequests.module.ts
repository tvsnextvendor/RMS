import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ApprovalrequestsComponent } from './approvalrequests.component';
import { ApprovalrequestsdetailsComponent } from './approvalrequestsdetails/approvalrequestsdetails.component';

import {NgxPaginationModule} from 'ngx-pagination';

const routes: Routes = [
    { path: 'approvalrequests', component:  ApprovalrequestsComponent ,canActivate : [AuthGuard]},
    { path: 'approvalrequestsdetails', component:ApprovalrequestsdetailsComponent ,canActivate : [AuthGuard]},
   
];

@NgModule({
  imports: [
    CommonModule,
     BrowserModule, 
    FormsModule,  
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule,
    NgxPaginationModule
  ],
  declarations: [ApprovalrequestsComponent, ApprovalrequestsdetailsComponent],
  bootstrap: [ApprovalrequestsComponent]
})
export class ApprovalrequestsModule { }
