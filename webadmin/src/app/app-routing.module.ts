import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './guard/auth.guard.component';
import {ResetpasswordComponent} from './resetpassword/resetpassword.component';
import {EmployeestatusComponent} from './employeestatus/employeestatus.component';

const routes: Routes = [
  { path: '', component: DashboardComponent,canActivate : [AuthGuard] },
  { path : 'login', component : LoginComponent},
  { path : 'resetpassword/:id', component : ResetpasswordComponent},
  { path : 'employeestatus', component : EmployeestatusComponent,canActivate : [AuthGuard]},
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
