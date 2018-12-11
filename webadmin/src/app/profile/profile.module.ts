import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'
import {ProfileComponent} from './profile.component';


const routes: Routes = [
    { path: 'profile', component:ProfileComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ],
  declarations: [
      ProfileComponent
  ],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
