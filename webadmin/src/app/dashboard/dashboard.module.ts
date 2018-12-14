import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material.module';
import { EmployeeChartsComponent } from './employee-charts/employee-charts.component';
import { ResortChartsComponent } from './resort-charts/resort-charts.component';
import { DoughnutChartComponent } from 'angular-d3-charts'; // this is needed!
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    NgbModule,
    SharedModule,
    CarouselModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    RouterModule.forRoot(routes)
    ],
  declarations: [
    DashboardComponent,
    EmployeeChartsComponent,
    ResortChartsComponent,
    DoughnutChartComponent
  ],
  bootstrap: [ DashboardComponent]
})
export class DashboardModule { }
