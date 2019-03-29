import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';

@NgModule({
  declarations: [
    HomePage,
  ],
  entryComponents: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ScrollingHeaderModule
  ],
})
export class HomePageModule {}