import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {QuizPage} from '../quiz/quiz';
//import {TrainingPage} from '../training/training';

@IonicPage()
@Component({selector: 'page-training-detail', templateUrl: 'training-detail.html'})
export class TrainingDetailPage {

    @ViewChild(Slides)slides : Slides;
    trainingDatas : any;
    detailObject;
    selectedIndexs : number;
    inactiveLeftButton : boolean = true;
    inactiveRightButton : boolean = true;
    activeLeftButton : boolean = false;
    activeRightButton : boolean = false;

    leftButton : boolean = true;
    rightButton : boolean = true;
    videoMenuTitle = "";
    currentVideoIndex   =   0;
    loadingBarWidth     =   0;
    constructor(public navCtrl : NavController, public navParams : NavParams) {

        this.detailObject = this.navParams.data;
        this.trainingDatas = this.detailObject['setData'];
        this.selectedIndexs = this.detailObject['selectedIndex'];
        this.loadingBarWidth    =   (100/parseInt(this.trainingDatas.length, 10));
    }

    goToSlideIndex() {
        this.slides.slideTo(this.selectedIndexs, 500);
    }

    slideChanged() {
        this.checkNavigationButton();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TrainingDetailPage');
    }

    ionViewWillEnter() {
        this.goToSlideIndex();
        this.checkNavigationButton();
    }

    goToQuizPage() {
        this.navCtrl.push(QuizPage);
    }

    goBackToDetailPage() {
       //this.navCtrl.push(TrainingPage);
       this.navCtrl.pop();
    }

    checkNavigationButton() {
        let currentIndex = this.slides.getActiveIndex();
        this.currentVideoIndex  =   currentIndex;
        let totalIndex = currentIndex + parseInt('1');
        let totalItems = this.trainingDatas.length;
        console.log('Current index is', currentIndex);

        this.videoMenuTitle = this.trainingDatas[currentIndex]['title'];

        if (currentIndex === 0) {
            this.leftButton = false;
            this.rightButton = true;
        } else if (totalItems === totalIndex) {
            this.leftButton = true;
            this.rightButton = false;
        } else {
            this.leftButton = true;
            this.rightButton = true;
        }
    }
}
