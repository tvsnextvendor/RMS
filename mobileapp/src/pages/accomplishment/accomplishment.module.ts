import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccomplishmentPage } from './accomplishment';
import { SanitizeHtmlPipe } from '../../service';


@NgModule({
  declarations: [
    AccomplishmentPage,
    SanitizeHtmlPipe
  ],
  imports: [
    IonicPageModule.forChild(AccomplishmentPage),
  ],
})
export class AccomplishmentPageModule {}
