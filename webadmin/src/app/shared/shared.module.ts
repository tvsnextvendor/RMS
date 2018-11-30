import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {SharedComponent } from './shared.component';
import {SideBarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';


@NgModule({
  imports: [
    BrowserModule,
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
