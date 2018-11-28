import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuizResultPage } from '../quiz-result/quiz-result';

@Component({
    selector: 'page-quiz',
    templateUrl: 'quiz.html'
})
export class QuizPage {
    quizData: Array<Object>;
    quizStep            =   0;
    selectedQuizContent =   {};
    isQuizCompleted     =   false;
    constructor(public navCtrl: NavController) {

    }
   //first load angular
    ngOnInit() {
        this.quizData   =   [
            {
                'title'         :   'Smart Style / Park Smart',
                'description'   :   'Start Small, Make a plan, Always look, Take it easy and _____ are part of the park smart terrain park safety program messages',
                'options'       :   [
                                        {
                                            'value' :   'respect',
                                            'label' :   'Respect'
                                        },
                                        {
                                            'value' :   'resolution',
                                            'label' :   'Resolution'
                                        },
                                        {
                                            'value' :   'determination',
                                            'label' :   'Determination'
                                        },
                                        {
                                            'value' :   'thermodynamic',
                                            'label' :   'Thermodynamic'
                                        }
                                    ]
            },
            {
                'title'         :   'Smart Style',
                'description'   :   'Start Small, Make a plan, Always look, Take it easy and _____ are part of the park smart terrain park safety program messages',
                'options'       :   [
                                        {
                                            'value' :   'respect',
                                            'label' :   'Respect'
                                        },
                                        {
                                            'value' :   'resolution',
                                            'label' :   'Resolution'
                                        },
                                        {
                                            'value' :   'determination',
                                            'label' :   'Determination'
                                        },
                                        {
                                            'value' :   'thermodynamic',
                                            'label' :   'Thermodynamic'
                                        }
                                    ]
            },
            {
                'title'         :   'Park Smart',
                'description'   :   'Start Small, Make a plan, Always look, Take it easy and _____ are part of the park smart terrain park safety program messages',
                'options'       :   [
                                        {
                                            'value' :   'respect',
                                            'label' :   'Respect'
                                        },
                                        {
                                            'value' :   'resolution',
                                            'label' :   'Resolution'
                                        },
                                        {
                                            'value' :   'determination',
                                            'label' :   'Determination'
                                        },
                                        {
                                            'value' :   'thermodynamic',
                                            'label' :   'Thermodynamic'
                                        }
                                    ]
            }
        ];

        this.getQuizContent ();
    }
    
    getQuizContent () {
        this.selectedQuizContent   =   this.quizData[this.quizStep];
    }
    // change selected question
    changeSelectedValue (option) {
        this.selectedQuizContent['selectedValue']   =   option.value;
        console.log(this.quizData);
    }
    // select previous question
    quizPreviousContent () {
        this.quizStep           =   this.quizStep - 1;
        this.getQuizContent();
    }
    // select next question
    quizNextContent () {
        console.log((this.quizData.length - 1) > this.quizStep);
        if (this.quizData && this.quizData.length && (this.quizData.length - 1 === this.quizStep)) {
            console.log('congratulation');
            this.isQuizCompleted    =   true;
            this.goBackToCongartulations();
        } else if (this.quizData.length > this.quizStep) {
            this.quizStep           =   this.quizStep + 1;
            this.getQuizContent();
        }
    }
    // back push stack
    goBackToDetailPage(){
        this.navCtrl.pop();
    }
    // final congrats
    goBackToCongartulations(){
        this.navCtrl.push(QuizResultPage)
    }

}
