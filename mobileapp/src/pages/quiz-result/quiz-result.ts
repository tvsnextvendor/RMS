import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../service/toastrService';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';

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
    currentUser: any;
    constructor(public navCtrl: NavController, public constant: Constant, public navParams: NavParams, public events: Events, private toastr: ToastrService, public auth: AuthProvider, private storage: Storage) {
        this.Math = Math;
        this.resultData = navParams.data;
        this.resultData['percentage'] = Math.round((this.resultData['correctAnswers'] / this.resultData['totalQuestions']) * 100);
        events.subscribe('star-rating:changed', (starRating) => {
            this.feedback.rating = starRating;
        });
    }
    ngOnInit() {
        this.feedbackform = new FormGroup({
            'description': new FormControl('', [Validators.required])
        });
        this.getUser();

    }

    closeToStart() {
        this.navCtrl.setRoot('training-page');
    }
    feedbackForm() {
        if (this.feedback && !this.feedback.rating) {
            this.toastr.error("Rating is required"); return false;
        } else {
            let percentages = [{ 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }];
            let postFeedback = {
                "courseId": this.resultData['courseId'],
                "ratingStar": this.feedback.rating,
                "ratingPercent": percentages[0][this.feedback.rating],
                "feedback": this.feedback.description,
                "score": this.resultData['correctAnswers'],
                "scoreOutof": this.resultData['totalQuestions'],
                "userId": this.currentUser.userId
            }
            console.log(postFeedback);
            this.toastr.success('Feedback saved successfully');
            this.closeToStart();
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
