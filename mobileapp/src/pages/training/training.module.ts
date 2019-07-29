import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingPage } from './training';
import { TruncateModule } from '@yellowspot/ng-truncate';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    TrainingPage,
  ],
  imports: [
    ScrollingHeaderModule,
    IonicPageModule.forChild(TrainingPage),
    TruncateModule,
    ComponentsModule
  ],
})
export class TrainingPageModule {}
