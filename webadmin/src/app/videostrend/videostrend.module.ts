import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import {VideosTrendComponent} from './videostrend.component';
import {VideosTrendDetailsComponent} from './videostrend-details/videostrend-details.component';
import {DataTableModule} from "angular-6-datatable";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule} from '@angular/forms';


const routes: Routes = [
    { path: 'videostrend', component:VideosTrendComponent ,canActivate : [AuthGuard]},
    { path : 'videostrend/:id', component:VideosTrendDetailsComponent, canActivate:[AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    DataTableModule,
    FormsModule,
    SelectDropDownModule
    ],
  declarations: [
    VideosTrendComponent,VideosTrendDetailsComponent
  ],
  bootstrap: [VideosTrendComponent]
})
export class VideosTrendModule { }
