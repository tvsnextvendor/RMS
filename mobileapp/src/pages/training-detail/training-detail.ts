import { Component, ViewChild ,Input} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Constant } from '../../constants/Constant.var';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { ToastrService } from '../../service/toastrService';

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
    courseName;
    setTraining: any;
    initial: number = 0;
    lastIndexs:number;
    quizBtn: boolean = false;
    imageType;
    filePath;
    trainingStatus;
    paramsToSend: any = {};
    isCollapsed: boolean = true;
    @Input() text: string;
    limit: number = 100;
    truncating = true;
    agree:boolean =false;
    courseId;

    constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, public alertCtrl: AlertController, private document: DocumentViewer,private toastr:ToastrService) {
        this.Math = Math;
        this.detailObject = this.navParams.data;
        this.courseName = this.detailObject['setData'].courseName;
        this.courseId = this.detailObject['setData'].courseId;
        this.trainingDatas = this.detailObject['setData'].files;
        this.lastIndexs = this.trainingDatas.length - 1;
        this.selectedIndexs = this.detailObject['selectedIndex'];
        this.trainingStatus = this.detailObject.status;
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
        this.setTraining = this.trainingDatas[0];
        this.text = this.setTraining.fileDescription;
        console.log('ionViewDidLoad TrainingDetailPage');
    }
    //  after load enter formed
    ionViewWillEnter() {
        // this.goToSlideIndex();
        //this.checkNavigationButton();
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
                    // console.log('Later clicked');
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    // let currentIndex = self.slides.getActiveIndex();
                    //  self.paramsData['menu'] = self.trainingDatas[currentIndex]['fileTitle'];
                    self.paramsData['courseId'] =  self.courseId 
                    self.paramsData['menu'] = self.courseName;
                    self.navCtrl.push(QuizPage, self.paramsData);
                }
            }]

        });
        alert.present();
    }
    // go back
    goBackToDetailPage() {
        this.paramsToSend['status'] = this.trainingStatus;
        this.navCtrl.pop(this.paramsToSend);
    }
    // navigation updations
    checkNavigationButton() {
        let currentIndex = this.slides.getActiveIndex();
        this.currentVideoIndex = currentIndex;
        let totalIndex = currentIndex + parseInt('1');
        let totalItems = this.trainingDatas.length;
        this.videoMenuTitle = this.trainingDatas[currentIndex]['fileTitle'];
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
    showNextPage()
    {
        this.initial = this.initial + 1;
        this.setTraining = this.trainingDatas[this.initial];
        this.setTraining.fileLink = this.getFileExtension(this.setTraining.fileLink);
        this.text = this.setTraining.fileDescription;
        this.quizBtn = (this.initial === this.lastIndexs)?true :false;
    }
    goBackLevel() 
    {
        if(this.initial === 0){
            this.goBackToDetailPage();
        }else{
            this.initial = this.initial - 1;
            this.setTraining = this.trainingDatas[this.initial];
            this.text = this.setTraining.fileDescription;
            this.setTraining.fileLink = this.getFileExtension(this.setTraining.fileLink);
            this.quizBtn = (this.initial === this.lastIndexs)?true :false;
        }
    }
    getFileExtension(filename) {
        let ext = /^.+\.([^.]+)$/.exec(filename);
        let fileType = ext == null ? "" : ext[1];
        let fileLink;
        switch (fileType) {
            case "pdf":
                fileLink = "assets/imgs/pdf.png";
                this.imageType = true;
                this.filePath = filename;
                break;
            case "txt":
                fileLink = "assets/imgs/text.png";
                this.imageType = true;
                this.filePath = filename;
                break;
            case "doc":
                fileLink = "assets/imgs/doc.png";
                this.imageType = true;
                this.filePath = filename;
                break;
            default:
                fileLink = filename;
                this.imageType = false;
                this.filePath = filename;
        }
        return fileLink;
    }
    viewContent(docFile) {
        if(this.agree){
            const options: DocumentViewerOptions = {
                title: 'My PDF'
            };
            let baseUrl =  'file:///android_asset/www/';
            //For IOS platform 
           // baseUrl = location.href.replace("/index.html", ""); 
            this.document.viewDocument(baseUrl + docFile, 'application/pdf', options);
        }else{
            this.toastr.error("Please agree acknowledgement to view content"); return false;
        }
      
    }
}
