import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
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

    constructor(public navCtrl: NavController,public storage: Storage ,private http: HttpProvider,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj.menu;
        this.trainingClassId = this.trainingObj.trainingClassId;
        this.courseId = this.trainingObj.courseId;
        this.courseName = this.trainingObj.courseName;
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
    ionViewDidLoad() {
        this.getQuizContent();
    }
    // Get Quiz Content
    getQuizContent() {
        this.selectedQuizContent = this.quizData[0].QuizMappings[this.quizStep].Question;
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
        if (this.quizData && this.quizData[0].QuizMappings.length && (this.quizData[0].QuizMappings.length - 1 === this.quizStep)) {
            this.isQuizCompleted = true;
            this.calcualteAndGoToCongartulations();
        } else if (this.quizData[0].QuizMappings.length > this.quizStep) {
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
        this.quizData[0].QuizMappings.map(quizValues => {
            if (quizValues.Question['selectedAnswer'] == quizValues.Question['answer']) {
                correctAnswersCount ++;
            }
        });
        const resultData = {
            "courseId"          : this.courseId,
            "totalQuestions"    : this.quizData[0].QuizMappings.length,
            "correctAnswers"    : correctAnswersCount,
            "trainingClassId"   : this.trainingClassId,
            "courseName": this.courseName,
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

   
}
