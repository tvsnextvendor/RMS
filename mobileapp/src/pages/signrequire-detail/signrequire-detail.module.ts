import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignrequireDetailPage } from './signrequire-detail';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
  declarations: [
    SignrequireDetailPage,
  ],
  imports: [
    TruncateModule,
    IonicPageModule.forChild(SignrequireDetailPage),
  ],
})
export class SignrequireDetailPageModule {}
