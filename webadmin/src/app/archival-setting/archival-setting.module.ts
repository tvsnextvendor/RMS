import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import {ArchivalSettingComponent} from './archival-setting.component';




const routes: Routes = [
    { path: 'archivalsetting', component:ArchivalSettingComponent ,canActivate : [AuthGuard]},
    
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
    
    ],
  declarations: [
    ArchivalSettingComponent,
  ],
  
})
export class ArchivalSettingModule { }
