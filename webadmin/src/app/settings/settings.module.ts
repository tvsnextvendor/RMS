import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component'
import {SettingsComponent  } from './settings.component';
import { FormsModule} from '@angular/forms';


const routes: Routes = [
    { path: 'settings', component:SettingsComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    FormsModule
    ],
  declarations: [
      SettingsComponent
  ],
  bootstrap: [SettingsComponent]
})
export class SettingsModule { }
