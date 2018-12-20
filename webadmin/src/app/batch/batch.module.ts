import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import {AuthGuard} from '../guard/auth.guard.component'
import {CalendarViewComponent} from './calendar-view/calendar-view.component';
import { FormsModule} from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AddBatchComponent} from './add-batch/add-batch.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

const routes: Routes = [
    { path: 'calendar', component:CalendarViewComponent ,canActivate : [AuthGuard]},
    { path: 'addBatch', component:AddBatchComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MultiselectDropdownModule,
    FormsModule,
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ],
  declarations: [
    CalendarViewComponent,
    AddBatchComponent
  ],
  bootstrap: [AddBatchComponent]
})
export class BatchModule { }
