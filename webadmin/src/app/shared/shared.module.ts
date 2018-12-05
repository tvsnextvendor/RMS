import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {SharedComponent } from './shared.component';
import {SideBarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule
  ],
  declarations: [
     SideBarComponent,
     HeaderComponent,
     SharedComponent
  ],
     exports: [SideBarComponent,
     HeaderComponent,
     SharedComponent],

  bootstrap: [SharedComponent]
})
export class SharedModule { }
