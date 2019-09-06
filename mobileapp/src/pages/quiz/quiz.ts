import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { Storage } from '@ionic/storage';
import _ from "lodash";


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
    nonMcqAns = "";
    ansArr=[];

    timeBegan = null
    timeStopped: any = null
    stoppedDuration: any = 0
    started = null
    running = false
    blankTime = "00:00.000"
    time;
    // time = "00:00.000"

    constructor(public navCtrl: NavController,public storage: Storage,private navParams:NavParams) {
        this.trainingObj = this.navParams.data;
        this.videoMenuTitle = this.trainingObj['setData'].trainingClassName;
        this.trainingClassId = this.trainingObj['setData'].trainingClassId;
        this.passPercentage = this.trainingObj['setData'].passPercentage;
        this.courseId = this.trainingObj['setData'].courseId;
        this.courseName = this.trainingObj['setData'].courseName;
        this.quizData = this.trainingObj.quizData;
        this.time = this.trainingObj.time;
        this.timeBegan = this.trainingObj.timeBegan;
        this.timeStopped = this.trainingObj.timeStopped;
        console.log(this.time,this.timeBegan,this.timeStopped,"TIME");
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
        this.start();
    }

   
       start() {
            if(this.running) return;
            // if (this.timeBegan === null) {
            //     //this.reset();
            //     this.timeBegan = new Date();
            // }
            if (this.timeStopped !== null) {
            let newStoppedDuration:any = (+new Date() - this.timeStopped)
            this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
            }
            this.started = setInterval(this.clockRunning.bind(this), 10);
            this.running = true;
        }

        stop() {
            this.running = false;
            this.timeStopped = new Date();
            clearInterval(this.started);
         }

       zeroPrefix(num, digit) {
            let zero = '';
            for(let i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
       }

       clockRunning(){
            let currentTime:any = new Date()
            let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
            let hour = timeElapsed.getUTCHours()
            let min = timeElapsed.getUTCMinutes()
            let sec = timeElapsed.getUTCSeconds()
            // let ms = timeElapsed.getUTCMilliseconds();
            this.time =
            this.zeroPrefix(hour, 2) + ":" +
            this.zeroPrefix(min, 2) + ":" +
            this.zeroPrefix(sec, 2);
            // this.zeroPrefix(ms, 3);
        };

       reset() {
            this.running = false;
            clearInterval(this.started);
            this.stoppedDuration = 0;
            this.timeBegan = null;
            this.timeStopped = null;
            this.time = this.blankTime;
      }




    // Get Quiz Content
    getQuizContent() {
        this.selectedQuizContent = this.quizData[0].Questions[this.quizStep];
    }

    // Change selected question
    changeSelectedValue(option) {
        if(this.selectedQuizContent['questionType'] == 'NON-MCQ'){
        this.selectedQuizContent['selectedAnswer'] = this.nonMcqAns;  
        }else{
        this.selectedQuizContent['selectedAnswer'] = option;    
        }      
    }

    // Select previous question
    quizPreviousContent() {
        this.quizStep = this.quizStep - 1;
        this.getQuizContent();
        this.nonMcqAns = this.ansArr[this.quizStep][this.quizStep];
        console.log(this.nonMcqAns,"Previous")
        
    }

    // Select next question
    quizNextContent() {
        if (this.quizData && this.quizData[0].Questions.length && (this.quizData[0].Questions.length - 1 === this.quizStep)) {
            this.isQuizCompleted = true;
            this.calcualteAndGoToCongartulations();
        } else if (this.quizData[0].Questions.length > this.quizStep) {         
           if(this.ansArr.length == 0 ){
               let obj = {};
               obj[this.quizStep] = this.selectedQuizContent['selectedAnswer'];
               this.ansArr.push(obj);
            }else{
                //  let arrNew = [{0:"App"},{1:"Green"},{3:"Blue"},{0:"App"},{3:"Blue"}]
                // _.uniqWith(arrNew, _.isEqual);
                this.ansArr.forEach((key,index) => {
                    if(index == this.quizStep){
                        key[index] = this.selectedQuizContent['selectedAnswer'];
                        return false;
                    }else{
                        console.log(index,"Index")
                        this.pushObj(index);       
                    }
                });
            }
            console.log(this.ansArr,"ANSWERArray");
            this.quizStep = this.quizStep + 1;
            this.getQuizContent();      
            if(this.ansArr.length > this.quizStep){
                this.nonMcqAns = this.ansArr[this.quizStep][this.quizStep];
            }else{
                this.nonMcqAns = this.ansArr[this.ansArr.length+1] == undefined ? "" : "";
            }            
        }
    }


    pushObj(index){
        console.log(index, this.ansArr,"AnsArr");
        if(index == this.ansArr.length-1){
            // this.ansArr.map((key,value)=>{
            //     console.log(key, this.quizStep, "Key");
            //     if(!key.hasOwnProperty(this.quizStep)){
                   //if(value !== index){
            let obj = {};
            obj[this.quizStep] = this.selectedQuizContent['selectedAnswer'];
            this.ansArr.push(obj);   
            //     }
            // })     
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
            "passPerc" : this.passPercentage,
        };
        this.navCtrl.push(QuizResultPage, resultData);
    }

   ngDestroy(){
       this.stop();
   }
}
