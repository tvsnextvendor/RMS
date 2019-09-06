import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainingDetailPage } from './training-detail';
import { TruncateModule } from '@yellowspot/ng-truncate';
//import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [
    TrainingDetailPage,
  ],
  imports: [
    TruncateModule,
    IonicPageModule.forChild(TrainingDetailPage),
    ComponentsModule
  ],
  providers:[File,FileTransfer]
})
export class TrainingDetailPageModule {
  
}
