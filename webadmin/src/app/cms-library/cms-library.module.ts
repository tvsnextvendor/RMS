import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component';
import { CMSLibraryComponent } from './cms-library.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BatchModule } from '../batch/batch.module';


const routes: Routes = [
    { path: 'cms-library', component:  CMSLibraryComponent ,canActivate : [AuthGuard]},
   
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
    FormsModule,  
    RouterModule.forRoot(routes),
    TooltipModule.forRoot(),
    BatchModule
  ],
  declarations: [CMSLibraryComponent],
  bootstrap: [CMSLibraryComponent]
})
export class CMSLibraryModule { }
