import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccomplishmentPage } from './accomplishment';

@NgModule({
  declarations: [
    AccomplishmentPage,
  ],
  imports: [
    IonicPageModule.forChild(AccomplishmentPage),
  ],
})
export class AccomplishmentPageModule {}
