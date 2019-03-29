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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule,OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

const routes: Routes = [
    { path: 'calendar', component:CalendarViewComponent ,canActivate : [AuthGuard]},
    { path: 'addBatch', component:AddBatchComponent ,canActivate : [AuthGuard]},
    { path: 'addBatch/:batchId', component:AddBatchComponent ,canActivate : [AuthGuard]},
];

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'ddd D MMM YYYY LT',
  datePickerInput: 'D MMM YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgHttpLoaderModule.forRoot(),
    BsDatepickerModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    DlDateTimePickerDateModule,
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ],
    providers: [
      {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
   ],
  declarations: [
    CalendarViewComponent,
    AddBatchComponent
  ],
  bootstrap: [AddBatchComponent]
})
export class BatchModule { }
