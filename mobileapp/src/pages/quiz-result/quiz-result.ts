import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from '../../service/toastrService';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { API_URL } from '../../constants/API_URLS.var';
import { HttpProvider } from '../../providers/http/http';

@IonicPage()
@Component({
    selector: 'page-quiz-result',
    templateUrl: 'quiz-result.html',
    providers: [Constant]
})
export class QuizResultPage implements OnInit {
    resultData = {};
    Math: any;
    feedback = {
        "rating": "",
        "description": ""
    }
    feedbackform: FormGroup;
    errorMessage;
    currentUser: any;
    msgToUser;
    trainingClassName;
    className;
    showToastr;
    msgTitle;
    success;
    msgDes;
    noQuiz= false;

    constructor(public navCtrl: NavController,public http: HttpProvider,public constant: Constant, public navParams: NavParams, public events: Events, public toastr: ToastrService, public auth: AuthProvider, private storage: Storage) {
        this.Math = Math;
        this.resultData = navParams.data;
        this.trainingClassName = this.resultData['trainingClassName'];
        this.noQuiz = this.resultData['status'] ? true : false ;
        // this.resultData['passPercentage'] = this.resultData['passPercentage'];
        this.resultData['percentage'] = Math.round((this.resultData['correctAnswers'] / this.resultData['totalQuestions']) * 100);
        events.subscribe('star-rating:changed', (starRating) => {
            this.feedback.rating = starRating;
        });        
    }
    
    ngOnInit() {
        this.feedbackform = new FormGroup({
          //  'description': new FormControl('', [Validators.required])
            'description': new FormControl('')
        });
        if(this.noQuiz || this.resultData['percentage'] >= this.resultData['passPerc'] ) {
           this.msgToUser = "You have successfully completed.";
           this.success = true;
        }else{
            this.msgToUser = "Please retake quiz to get certified.";
            this.success = false;
        }
     
        this.getUser();

    }

    closeToStart() {
        this.navCtrl.push('course-page');
    }
    
    feedbackForm() {
         if (!this.feedback.rating) {
             this.errorMessage =  "Rating is required"; return false;
         }else {
        //     this.errorMessage =  "Suggestions / Feedback is required"; return false;
        // } else {
           this.errorMessage  = '';
            let percentages = [{ 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }];
            const resortId = this.currentUser.ResortUserMappings[0].resortId;
            let postData = {
                "courseId": this.resultData['courseId'],
                "ratingStar": this.feedback.rating,
                "ratingPercent": percentages[0][this.feedback.rating],
                "feedback": this.feedback.description,
                "score": this.resultData['correctAnswers'],
                "scoreOutof": this.resultData['totalQuestions'],
                "userId": this.currentUser.userId,
                "resortId":resortId,
                "trainingClassId" : this.resultData['trainingClassId'] 
            }
            if(this.noQuiz){
                postData['passPercentage'] = 100;
            }
            this.http.post(false,API_URL.URLS.postFeedBack,postData).subscribe(res=>{
                if(res['isSuccess']){
                    this.toastr.success(res['message']);
                    this.completeTrainingClass();
                    this.closeToStart();
                }
            })
        }
    }
    

   successMessage(msg){
        this.showToastr = true;
        this.className = "notify-box alert alert-success";
        this.msgTitle = "Success";
        this.msgDes = msg ;
        let self = this;
        setTimeout(function(){ 
        self.showToastr = false;
        }, 3000); 
   }

    getUser() {
        this.storage.get('currentUser').then(
            (val) => {
                if (val) {
                    this.currentUser = val;
                }
            }, (err) => {
                console.log('currentUser not received in app.component.ts', err);
            });
    }

     completeTrainingClass(){
     
        let data = this.resultData;
        let typeSetData = this.resultData['typeSet'] ? this.resultData['typeSet'] : this.resultData['setData'].typeSet;
        let postData={
            "courseId": data['courseId'],
            "trainingClassId": data['trainingClassId'],
            "userId":this.currentUser.userId,
            "courseName": data['courseName'],
            "trainingClassName":data['trainingClassName'],
            "typeSet":typeSetData,
            "userName": this.currentUser.userName,
            "lastName":this.currentUser.lastName,
            "resortId": this.currentUser.ResortUserMappings[0].resortId,
            "trainingScheduleId": this.resultData['scheduleId'],
            "status":"completed"
        }
        this.http.put(false, API_URL.URLS.completeTrainingClass,postData).subscribe(res=>{
            if(res['isSuccess']){
                this.http.put(false, API_URL.URLS.completeTrainingClass,postData).subscribe(res=>{
                })
            }
        })
    }
}
