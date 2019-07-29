import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccomplishmentPage } from './accomplishment';
import { SanitizeHtmlPipe } from '../../service';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    AccomplishmentPage,
    SanitizeHtmlPipe
  ],
  imports: [
    IonicPageModule.forChild(AccomplishmentPage),
    ComponentsModule
  ],
})
export class AccomplishmentPageModule {}
