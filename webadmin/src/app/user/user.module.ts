import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component'
import {UserComponent  } from './user.component';
import { FormsModule} from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';

const routes: Routes = [
    { path: 'users', component:UserComponent ,canActivate : [AuthGuard]},
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    FormsModule,
    CarouselModule
    ],
  declarations: [
    UserComponent
  ],
  bootstrap: [UserComponent]
})
export class UserModule { }
