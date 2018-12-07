import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import {VideosTrendComponent} from './videostrend.component';
import {VideosTrendDetailsComponent} from './videostrend-details/videostrend-details.component';
import {DataTableModule} from "angular-6-datatable";


const routes: Routes = [
    { path: 'videostrend', component:VideosTrendComponent ,canActivate : [AuthGuard]},
    { path : 'videostrend/:id', component:VideosTrendDetailsComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    DataTableModule
    ],
  declarations: [
    VideosTrendComponent,VideosTrendDetailsComponent
  ],
  bootstrap: [VideosTrendComponent]
})
export class VideosTrendModule { }
