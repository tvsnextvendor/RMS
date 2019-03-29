import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LibraryPage } from './library';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { TruncateModule } from '@yellowspot/ng-truncate';
@NgModule({
  declarations: [
    LibraryPage,
  ],
  imports: [
    TruncateModule,
    ScrollingHeaderModule,
    IonicPageModule.forChild(LibraryPage),
  ],
})
export class LibraryPageModule {}
