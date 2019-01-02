import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Events} from 'ionic-angular';
import { Constant} from '../../constants/Constant.var';

@IonicPage()
@Component({
    selector: 'page-quiz-result',
    templateUrl: 'quiz-result.html',
    providers:[Constant]
})
export class QuizResultPage {
    resultData  =   {};
    Math: any;
    feedback = {
        "description":""
    }
    constructor(public navCtrl: NavController,public constant:Constant, public navParams:NavParams,public events: Events) {
        this.Math       =   Math;
        this.resultData =   navParams.data;
        this.resultData['percentage']   =   Math.round((this.resultData['correctAnswers']/this.resultData['totalQuestions'])*100);
        events.subscribe('star-rating:changed', (starRating) => {console.log(starRating)});
    }

    closeToStart(){
        this.navCtrl.setRoot('home-page');
    }
    feedbackForm() {
        console.log(this.feedback)
      }

}
