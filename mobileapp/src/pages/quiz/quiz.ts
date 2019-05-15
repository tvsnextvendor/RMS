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
    currentUser;

    constructor(public navCtrl: NavController,public storage: Storage ,private http: HttpProvider,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj.menu;
        this.trainingClassId = this.trainingObj.trainingClassId;
        this.courseId = this.trainingObj.courseId;
        this.quizData = this.trainingObj.quizData;
    }

     ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
             console.log(self.currentUser, "HEHEHEHE");             
            }
        });
  }
    //first load
    ionViewDidLoad() {
        this.getQuizContent();
    }
    // Get Quiz Content
    getQuizContent() {
        this.selectedQuizContent = this.quizData[this.quizStep];
    }

    // Change selected question
    changeSelectedValue(option) {
        console.log(option)
        this.selectedQuizContent['selectedAnswer'] = option;
        
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
        // let userId = this.currentUser.userId;
        // let data={
        // 'courseId' : this.courseId,
        // 'userId'   : userId,
        // 'status'   : "completed",
        // 'completedDate' : new Date()
        // }
        // this.http.put(false,API_URL.URLS.updateTrainingStatus, data).subscribe((res) => {
        
        // },(err) => {

        // });
        this.completeTrainingClass();

        let correctAnswersCount  =   0;
        this.quizData.forEach(quizValues => {
            console.log(quizValues['selectedAnswer'], quizValues['answer'] , quizValues ,"values")
            if (quizValues['selectedAnswer'] == quizValues['answer']) {
                correctAnswersCount ++;
            }
        });
        const resultData = {
            "courseId"          : this.courseId,
            "totalQuestions"    : this.quizData.length,
            "correctAnswers"    : correctAnswersCount,
            "trainingClassId"   : this.trainingClassId 
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

    completeTrainingClass(){
        let postData={
            "courseId":this.courseId,
            "trainingClassId": this.trainingClassId,
            "userId":this.currentUser.userId,
            "status":"Completed"
        }

        this.http.put(false, API_URL.URLS.completeTrainingClass,postData).subscribe(res=>{
            if(res['isSuccess']){
                this.http.put(false, API_URL.URLS.completeTrainingClass,postData).subscribe(res=>{
                })
            }
        })
    }
}
