import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { Storage } from '@ionic/storage';

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
    courseName;
    currentUser;
    passPercentage;

    constructor(public navCtrl: NavController,public storage: Storage,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj['setData'].trainingClassName;
        this.trainingClassId = this.trainingObj['setData'].trainingClassId;
        this.passPercentage = this.trainingObj['setData'].passPercentage;
        this.courseId = this.trainingObj['setData'].courseId;
        this.courseName = this.trainingObj['setData'].courseName;
        this.quizData = this.trainingObj.quizData;
    }

     ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
            }
        });
  }
    //first load
    ngOnInit() {
        this.getQuizContent();
    }
    // Get Quiz Content
    getQuizContent() {
        this.selectedQuizContent = this.quizData[0].Questions[this.quizStep];
    }

    // Change selected question
    changeSelectedValue(option) {
        this.selectedQuizContent['selectedAnswer'] = option;        
    }

    // Select previous question
    quizPreviousContent() {
        this.quizStep = this.quizStep - 1;
        this.getQuizContent();
    }

    // Select next question
    quizNextContent() {
        if (this.quizData && this.quizData[0].Questions.length && (this.quizData[0].Questions.length - 1 === this.quizStep)) {
            this.isQuizCompleted = true;
            this.calcualteAndGoToCongartulations();
        } else if (this.quizData[0].Questions.length > this.quizStep) {
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
        this.quizData[0].Questions.map(quizValues => {
            if (quizValues['selectedAnswer'] == quizValues['answer']) {
                correctAnswersCount ++;
            }
        });
        const resultData = {
            "courseId"          : this.courseId,
            "totalQuestions"    : this.quizData[0].Questions.length,
            "correctAnswers"    : correctAnswersCount,
            "trainingClassId"   : this.trainingClassId,
            "scheduleId": this.trainingObj['setData'].trainingScheduleId,
            "trainingClassName" : this.trainingObj['setData'].trainingClassName,
            "typeSet" : this.trainingObj['setData'].typeSet,
            "courseName": this.courseName,
            "passPerc" : this.passPercentage 
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

   
}
