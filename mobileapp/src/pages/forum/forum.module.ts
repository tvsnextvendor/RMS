import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumPage } from './forum';

import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    ForumPage
  ],
  imports: [
    IonicPageModule.forChild(ForumPage),
    ModalModule.forRoot()
  ],
})
export class ForumPageModule {}
