import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../../service/toastrService';

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
    constructor(public navCtrl: NavController, public constant: Constant, public navParams: NavParams, public events: Events,private toastr:ToastrService) {
        this.Math = Math;
        this.resultData = navParams.data;
        this.resultData['percentage'] = Math.round((this.resultData['correctAnswers'] / this.resultData['totalQuestions']) * 100);
        events.subscribe('star-rating:changed', (starRating) => { 
            this.feedback.rating = starRating;
            
            console.log(starRating)
         });
    }
    ngOnInit() {
        this.feedbackform = new FormGroup({
            'description': new FormControl('', [Validators.required]),
            //'rating':new FormControl('', [Validators.required]),
        });
    }

    closeToStart() {
        this.navCtrl.setRoot('home-page');
    }
    feedbackForm() {
        console.log(this.feedback);
        this.toastr.success('Feedback saved successfully');
        this.closeToStart();
    }
}
