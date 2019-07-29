import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {ScrollingHeaderModule} from 'ionic-scrolling-header';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    HomePage,
  ],
  entryComponents: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ScrollingHeaderModule,
    ComponentsModule
  ],
})
export class HomePageModule {}