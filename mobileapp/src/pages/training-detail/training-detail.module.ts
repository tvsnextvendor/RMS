import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingDetailPage } from './training-detail';

@NgModule({
  declarations: [
    TrainingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainingDetailPage),
  ],
})
export class TrainingDetailPageModule {
  
}
