import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import { FormsModule} from '@angular/forms';
import {ResortComponent} from './resort.component';
import { SharedModule } from "../shared/shared.module";

const routes: Routes = [
    { path: 'resorts', component:ResortComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot()
    ],
  declarations: [
    ResortComponent
  ],
  bootstrap: [ResortComponent]
})
export class ResortModule { }
