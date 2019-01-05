import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingDetailPage } from './training-detail';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
  declarations: [
    TrainingDetailPage,
  ],
  imports: [
    TruncateModule,
    IonicPageModule.forChild(TrainingDetailPage),
  ],
})
export class TrainingDetailPageModule {
  
}
