import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {SharedComponent } from './shared.component';
import {SideBarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';
import {ModuleDropdownComponent} from './header/module-dropdown';
import { FormsModule} from '@angular/forms';
import { SanitizeHtmlPipe } from './safeHtmlPipe';
import { NotificationComponent } from './notification/notification.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
     SideBarComponent,
     HeaderComponent,
     SanitizeHtmlPipe,
     SharedComponent,
     ModuleDropdownComponent,
     NotificationComponent
  ],
     exports: [SideBarComponent,
     HeaderComponent,
     SharedComponent,
     SanitizeHtmlPipe,
     ModuleDropdownComponent],

  bootstrap: [SharedComponent]
})
export class SharedModule { }
