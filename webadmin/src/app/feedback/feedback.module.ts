import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import { FormsModule} from '@angular/forms';
import { FeedbackComponent } from './feedback.component'; 

const routes: Routes = [
  { path: 'feedback', component:FeedbackComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
   
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot()
    ],
  declarations: [
    FeedbackComponent
  ]

})
export class FeedBackModule { }
