import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../guard/auth.guard.component'
import {CreateModuleComponent} from './create-module.component';
import { FormsModule} from '@angular/forms';


const routes: Routes = [
    { path: 'addModule', component:CreateModuleComponent ,canActivate : [AuthGuard]},
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
    ],
  declarations: [
      CreateModuleComponent
  ],
  bootstrap: [CreateModuleComponent]
})
export class moduleModule { }
