import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizPage } from './quiz';

@NgModule({
  declarations: [
    QuizPage,
  ],
  entryComponents: [
    QuizPage
  ],
  imports: [
    IonicPageModule.forChild(QuizPage),
  ],
})
export class QuizPageModule {}