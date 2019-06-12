import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import { FormsModule} from '@angular/forms';
import { FeedbackComponent } from './feedback.component';
import { TabsModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  { path: 'feedback', component: FeedbackComponent , canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    NgbModule,
    BrowserModule
    ],
  declarations: [
    FeedbackComponent
  ]

})
export class FeedBackModule { }
