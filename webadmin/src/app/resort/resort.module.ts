import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import {DataTableModule} from "angular-6-datatable";
import { FormsModule} from '@angular/forms';
import {ResortComponent} from './resort.component';
import { SharedModule } from "../shared/shared.module";
import { ResortListComponent } from './resort-list/resort-list.component';

const routes: Routes = [
  { path: 'resortslist', component:ResortListComponent ,canActivate : [AuthGuard]},
  { path: 'resorts/:id', component:ResortComponent ,canActivate : [AuthGuard]},
  { path: 'resorts', component:ResortComponent ,canActivate : [AuthGuard]}
];

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    DataTableModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot()
    ],
  declarations: [
    ResortComponent,
    ResortListComponent
  ],
  bootstrap: [ResortComponent]
})
export class ResortModule { }
