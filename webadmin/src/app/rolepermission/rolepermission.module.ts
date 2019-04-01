import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { RolepermissionComponent } from './rolepermission/rolepermission.component';

const routes: Routes = [
    { path: 'rolepermission', component: RolepermissionComponent ,canActivate : [AuthGuard]},
   
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,   
    RouterModule.forRoot(routes),
  ],
  declarations: [RolepermissionComponent]
})
export class RolepermissionModule { }
