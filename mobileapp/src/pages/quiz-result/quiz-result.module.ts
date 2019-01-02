import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizResultPage } from './quiz-result';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    QuizResultPage,
  ],
  entryComponents: [
    QuizResultPage
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(QuizResultPage),
  ],
})
export class QuizResultModule {}