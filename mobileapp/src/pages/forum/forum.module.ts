import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumPage } from './forum';
import { ComponentsModule } from '../../components/components.module';
import { ModalModule } from 'ngx-bootstrap';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';

@NgModule({
  declarations: [
    ForumPage
  ],
  imports: [
    IonicPageModule.forChild(ForumPage),
    ModalModule.forRoot(),
    ScrollingHeaderModule,
    ComponentsModule
  ],
})
export class ForumPageModule {}
