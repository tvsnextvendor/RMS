import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Constant } from '../../constants/Constant.var';

@IonicPage({
    name: 'trainingdetail-page'
})
@Component({ selector: 'page-training-detail', templateUrl: 'training-detail.html', providers: [Constant] })
export class TrainingDetailPage {

    @ViewChild(Slides) slides: Slides;
    trainingDatas: any;
    detailObject;
    selectedIndexs: number;
    inactiveLeftButton: boolean = true;
    inactiveRightButton: boolean = true;
    activeLeftButton: boolean = false;
    activeRightButton: boolean = false;

    leftButton: boolean = true;
    rightButton: boolean = true;
    videoMenuTitle = "";
    currentVideoIndex = 0;
    loadingBarWidth = 0;
    Math: any;
    paramsData: any = {};
    constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public alertCtrl: AlertController) {
        this.Math = Math;
        this.detailObject = this.navParams.data;
        this.trainingDatas = this.detailObject['setData'].videos;
        this.selectedIndexs = this.detailObject['selectedIndex'];
        this.loadingBarWidth = (100 / parseInt(this.trainingDatas.length, 10));
    }
    // go to particular index
    goToSlideIndex() {
        this.slides.slideTo(this.selectedIndexs, 500);
    }
    // event slide changed
    slideChanged() {
        this.checkNavigationButton();
    }
    // first page load
    ionViewDidLoad() {
        console.log('ionViewDidLoad TrainingDetailPage');
    }
    //  after load enter formed
    ionViewWillEnter() {
        this.goToSlideIndex();
        this.checkNavigationButton();
    }
    // go to quiz page for training details
    goToQuizPage() {
        let self = this;
        const alert = this.alertCtrl.create({
            title: 'Are you ready to take the comprehension ?',
            buttons: [{
                text: 'Later',
                role: 'later',
                handler: () => {
                    console.log('Later clicked');
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    let currentIndex = self.slides.getActiveIndex();
                    self.paramsData['menu'] = self.trainingDatas[currentIndex]['videoTitle'];
                    self.navCtrl.push(QuizPage, self.paramsData);
                }
            }]

        });
        alert.present();
    }
    // go back
    goBackToDetailPage() {
        this.navCtrl.pop();
    }
    // navigation updations
    checkNavigationButton() {
        let currentIndex = this.slides.getActiveIndex();
        this.currentVideoIndex = currentIndex;
        let totalIndex = currentIndex + parseInt('1');
        let totalItems = this.trainingDatas.length;
        this.videoMenuTitle = this.trainingDatas[currentIndex]['videoTitle'];

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
