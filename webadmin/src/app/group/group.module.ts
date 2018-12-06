import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'
import { GroupComponent } from './group.component';


const routes: Routes = [
    { path: 'groups', component: GroupComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ],
  declarations: [
      GroupComponent
  ],
  bootstrap: [GroupComponent]
})
export class GroupModule { }
