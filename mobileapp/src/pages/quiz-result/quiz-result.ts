import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    constructor(public navCtrl: NavController,public constant:Constant, public navParams:NavParams) {
        this.Math       =   Math;
        this.resultData =   navParams.data;
        this.resultData['percentage']   =   Math.round((this.resultData['correctAnswers']/this.resultData['totalQuestions'])*100);
    }

    closeToStart(){
        this.navCtrl.setRoot('home-page');
    }

}
