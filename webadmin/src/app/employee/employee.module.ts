import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {DataTableModule} from "angular-6-datatable";
import {AuthGuard} from '../guard/auth.guard.component';
import { EmployeestatusComponent } from './employeestatus/employeestatus.component';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';


const routes: Routes = [
    { path: 'employeestatus', component: EmployeestatusComponent ,canActivate : [AuthGuard]},
    { path: 'employeedetails', component: EmployeedetailsComponent,canActivate : [AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    SelectDropDownModule,
    DataTableModule
    ],
  declarations: [
    EmployeestatusComponent,
    EmployeedetailsComponent
  ],
  bootstrap: []
})
export class EmployeeModule { }
