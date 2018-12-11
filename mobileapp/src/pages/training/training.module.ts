import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingPage } from './training';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
  declarations: [
    TrainingPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainingPage),
    TruncateModule
  ],
})
export class TrainingPageModule {}
