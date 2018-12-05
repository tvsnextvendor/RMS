import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material.module';
import { EmployeeChartsComponent } from './employee-charts/employee-charts.component';
import { ResortChartsComponent } from './resort-charts/resort-charts.component';
import { DoughnutChartComponent } from 'angular-d3-charts'; // this is needed!
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    NgbModule,
    SharedModule,
    CarouselModule.forRoot()

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
