import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {VideosTrendComponent} from './videostrend.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {VideosTrendDetailsComponent} from './videostrend-details/videostrend-details.component';
import {DataTableModule} from "angular-6-datatable";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { ExpiretrendComponent } from './expiretrend/expiretrend.component';
import { ExpiretrenddetailsComponent } from './expiretrenddetails/expiretrenddetails.component';
import { ClasstrendComponent } from './classtrend/classtrend.component';


const routes: Routes = [
    { path: 'videostrend', component:VideosTrendComponent ,canActivate : [AuthGuard]},
    { path : 'videostrend/:id', component:VideosTrendDetailsComponent, canActivate:[AuthGuard] },
    { path : 'expiring/trend', component:ExpiretrendComponent, canActivate:[AuthGuard] },
    { path : 'expiring/trend/:id', component:ExpiretrenddetailsComponent, canActivate:[AuthGuard] },
    { path: 'classtrend', component:ClasstrendComponent ,canActivate : [AuthGuard]},
    // { path : 'classtrend/:id', component:VideosTrendDetailsComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    DataTableModule,
    FormsModule,
    SelectDropDownModule,
    TabsModule,
    ModalModule,
    NgMultiSelectDropDownModule
    ],
  declarations: [
    VideosTrendComponent,VideosTrendDetailsComponent, ExpiretrendComponent, ExpiretrenddetailsComponent, ClasstrendComponent
  ],
  bootstrap: [VideosTrendComponent]
})
export class VideosTrendModule { }
