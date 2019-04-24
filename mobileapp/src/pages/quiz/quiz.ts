import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';

@IonicPage({
    name: 'quiz-page'
  })
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
    trainingClassId;
    courseId;

    constructor(public navCtrl: NavController, private http: HttpProvider,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj.menu;
        this.trainingClassId = this.trainingObj.trainingClassId;
        this.courseId = this.trainingObj.courseId;
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
        console.log(option)
        this.selectedQuizContent['selectedAnswer'] = option;
        console.log(this.selectedQuizContent);
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
        console.log(this.quizData);
        this.quizData.forEach(quizValues => {
            if (quizValues['selectedAnswer'] == quizValues['answer']) {
                correctAnswersCount ++;
            }
        });
        const resultData = {
            "totalQuestions"    : this.quizData.length,
            "correctAnswers"    : correctAnswersCount,
            "trainingClassId"   : this.trainingClassId 
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

    //Get Quiz API datas
    getQuizDatas() {
        this.http.get(API_URL.URLS.quizAPI + '?trainingClassId=' + this.trainingClassId + '&courseId=' + this.courseId).subscribe((res) => {
            if (res['isSuccess']) {
                const quiz = res['data'];
                this.quizData =quiz[0].CourseTrainingClassMaps[0].TrainingClass.Questions;
                console.log(this.quizData);
                this.getQuizContent();
            }
        });
    }


    // getQuizInfos() {
    //     this.http.getData(API_URL.URLS.getQuiz).subscribe((data) => {
    //         if (data) {
    //             this.quizData = data;
    //             console.log(this.quizData);
    //             this.getQuizContent();
    //         }
    //     });
    // }

}
