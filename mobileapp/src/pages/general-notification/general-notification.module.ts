import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralNotificationPage } from './general-notification';

@NgModule({
  declarations: [
    GeneralNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneralNotificationPage),
  ],
})
export class GeneralNotificationPageModule {}
