import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {DataTableModule} from "angular-6-datatable";
import {AuthGuard} from '../guard/auth.guard.component';
import { SubscriptionComponent } from './subscription.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';



const routes: Routes = [
    { path: 'subscription', component: SubscriptionComponent ,canActivate : [AuthGuard]},
    { path: 'subscriptionlist', component: SubscriptionListComponent ,canActivate : [AuthGuard]},
   
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    SelectDropDownModule,
    DataTableModule
    ],
  declarations: [
    SubscriptionComponent,
    SubscriptionListComponent
    
  ],
  bootstrap: []
})
export class SubscriptionModule { }
