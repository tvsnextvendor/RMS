import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { CMSLibraryComponent } from './cms-library.component';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const routes: Routes = [
    { path: 'cms-library', component:  CMSLibraryComponent ,canActivate : [AuthGuard]},
   
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule, 
    FormsModule,  
    RouterModule.forRoot(routes),
    TooltipModule.forRoot(),
  ],
  declarations: [CMSLibraryComponent]
})
export class CMSLibraryModule { }
