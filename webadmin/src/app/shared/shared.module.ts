import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {SharedComponent } from './shared.component';
import {SideBarComponent} from './sidebar/sidebar.component';
import {HeaderComponent} from './header/header.component';
import {ModuleDropdownComponent} from './header/module-dropdown';
import { FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
     SideBarComponent,
     HeaderComponent,
     SharedComponent,
     ModuleDropdownComponent
  ],
     exports: [SideBarComponent,
     HeaderComponent,
     SharedComponent,
     ModuleDropdownComponent],

  bootstrap: [SharedComponent]
})
export class SharedModule { }
