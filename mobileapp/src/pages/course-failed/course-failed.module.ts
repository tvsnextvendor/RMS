import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseFailedPage } from './course-failed';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    CourseFailedPage,
  ],
  imports: [
    IonicPageModule.forChild(CourseFailedPage),
    ComponentsModule
  ],
})
export class CourseFailedPageModule {}
