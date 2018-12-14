import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'
import {AddModuleComponent} from './add-module/add-module.component';
import { FormsModule} from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


const routes: Routes = [
    { path: 'addModule', component:AddModuleComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule
    ],
  declarations: [
    AddModuleComponent
  ],
  bootstrap: [AddModuleComponent]
})
export class moduleModule { }
