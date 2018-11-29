import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { HttpProvider } from '../../providers/http/http';

@Component({
    selector: 'page-quiz',
    templateUrl: 'quiz.html'
})
export class QuizPage {
    quizData: any;
    quizStep = 0;
    selectedQuizContent = {};
    isQuizCompleted = false;
    trainingObj;
    videoMenuTitle;

    constructor(public navCtrl: NavController, private http: HttpProvider,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj.menu;

    }

    //first load
    ionViewDidLoad() {
        this.getQuizDatas();
    }

    // Get Quiz Content
    getQuizContent() {
        this.selectedQuizContent = this.quizData[this.quizStep];
    }

    // Change selected question
    changeSelectedValue(option) {
        this.selectedQuizContent['selectedAnswer'] = option.value;
    }

    // Select previous question
    quizPreviousContent() {
        this.quizStep = this.quizStep - 1;
        this.getQuizContent();
    }

    // Select next question
    quizNextContent() {
        if (this.quizData && this.quizData.length && (this.quizData.length - 1 === this.quizStep)) {
            this.isQuizCompleted = true;
            this.calcualteAndGoToCongartulations();
        } else if (this.quizData.length > this.quizStep) {
            this.quizStep = this.quizStep + 1;
            this.getQuizContent();
        }
    }

    // Back push stack
    goBackToDetailPage() {
        this.navCtrl.pop();
    }

    // Final Congrats
    calcualteAndGoToCongartulations() {
        let correctAnswersCount  =   0;
        this.quizData.forEach(quizValues => {
            if (quizValues['selectedAnswer'] === quizValues['correctAnswer']['value']) {
                correctAnswersCount ++;
            }
        });
        const resultData = {
            "totalQuestions"    : this.quizData.length,
            "correctAnswers"    :   correctAnswersCount
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

    //Get Quiz API datas
    getQuizDatas() {
        this.http.get('./assets/apidata/quiz.json').subscribe((data) => {
            if (data) {
                this.quizData = data;
                this.getQuizContent();
            }
        });
    }

}
