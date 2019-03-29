import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component'
import {ProfileComponent} from './profile.component';
import { FormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common'
import { BsDatepickerModule } from 'ngx-bootstrap';



const routes: Routes = [
    { path: 'profile', component:ProfileComponent ,canActivate : [AuthGuard]},
    { path: 'editprofile', component:ProfileComponent ,canActivate : [AuthGuard]},

];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BsDatepickerModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    FormsModule
    ],
  declarations: [
      ProfileComponent
  ],
  providers: [DatePipe],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
