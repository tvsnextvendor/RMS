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
    constructor(public navCtrl: NavController,public http: HttpProvider,public constant: Constant, public navParams: NavParams, public events: Events, public toastr: ToastrService, public auth: AuthProvider, private storage: Storage) {
        this.Math = Math;
        this.resultData = navParams.data;
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
        if(this.resultData['correctAnswers'] >= ( this.resultData['totalQuestions'] / 2 ) ) {
           this.msgToUser = "Congratulations";
        }else{
            this.msgToUser = "Better luck next time";
        }
     
        this.getUser();

    }

    closeToStart() {
        this.navCtrl.setRoot('course-page');
    }
    feedbackForm() {
        if (this.feedback && !this.feedback.rating) {
            this.errorMessage =  "Rating is required"; return false;
           // this.toastr.error("Rating is required"); return false;
        } else {
            this.errorMessage  = '';
            let percentages = [{ 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }];
            let postData = {
                "courseId": this.resultData['courseId'],
                "ratingStar": this.feedback.rating,
                "ratingPercent": percentages[0][this.feedback.rating],
                "feedback": this.feedback.description,
                "score": this.resultData['correctAnswers'],
                "scoreOutof": this.resultData['totalQuestions'],
                "userId": this.currentUser.userId
            }
            console.log(postData);
            this.http.post(false,API_URL.URLS.postFeedBack,postData).subscribe(res=>{
                if(res['isSuccess']){
                    this.toastr.success(res['message']);
                    this.closeToStart();
                }
            })
        }
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
}
