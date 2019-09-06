import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    QuizPage,
  ],
  entryComponents: [
    QuizPage
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
    ComponentsModule
  ],
})
export class QuizPageModule {}