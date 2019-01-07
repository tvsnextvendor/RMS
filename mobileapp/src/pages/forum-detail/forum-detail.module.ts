import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumDetailPage } from './forum-detail';
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [
    ForumDetailPage,
    TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(ForumDetailPage),
  ],
})
export class ForumDetailPageModule {}
