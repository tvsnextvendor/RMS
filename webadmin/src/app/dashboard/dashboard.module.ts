import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { DoughnutChartComponent } from 'angular-d3-charts';
import {DataTableModule} from "angular-6-datatable";
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DashboardComponent } from './dashboard.component';
import { EmployeeChartsComponent } from './employee-charts/employee-charts.component';
import { ResortChartsComponent } from './resort-charts/resort-charts.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../guard/auth.guard.component';
import { ResortListComponent } from './resort-list/resort-list.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'resortList', component: ResortListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    SharedModule,
    CarouselModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    RouterModule.forRoot(routes),
    DataTableModule
  ],
  declarations: [
    // DoughnutChartComponent,
    DashboardComponent,
    EmployeeChartsComponent,
    ResortChartsComponent,
    ResortListComponent
  ],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
