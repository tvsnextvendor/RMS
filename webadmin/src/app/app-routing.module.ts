import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './guard/auth.guard.component';
import {ResetpasswordComponent} from './resetpassword/resetpassword.component';

const routes: Routes = [
  { path: '', component: DashboardComponent,canActivate : [AuthGuard] },
  { path : 'login', component : LoginComponent},
  { path : 'resetpassword/:id', component : ResetpasswordComponent}
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
