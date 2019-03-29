import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    ScrollingHeaderModule,
    IonicPageModule.forChild(SettingsPage),
  ],
})
export class SettingsPageModule { }
