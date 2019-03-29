import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForumDetailPage } from './forum-detail';
import {TimeAgoPipe} from 'time-ago-pipe';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';

@NgModule({
  declarations: [
    ForumDetailPage,
    TimeAgoPipe
  ],
  imports: [
    IonicPageModule.forChild(ForumDetailPage),
    ScrollingHeaderModule
  ],
})
export class ForumDetailPageModule {}
