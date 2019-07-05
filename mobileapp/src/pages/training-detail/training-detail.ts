import { Component, ViewChild, Input ,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { Constant } from '../../constants/Constant.var';
import {ToastrService} from '../../service/toastrService';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { API } from '../../constants/API.var';
import { Storage } from '@ionic/storage';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@IonicPage({
    name: 'trainingdetail-page'
})

@Component({ selector: 'page-training-detail', templateUrl: 'training-detail.html', providers: [Constant, InAppBrowser] })
export class TrainingDetailPage {

    @ViewChild(Slides) slides: Slides;
    @ViewChild("videoTag") videotag: ElementRef;
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
    setTraining: any;
    initial: number = 0;
    lastIndexs: number;
    quizBtn: boolean = false;
    quizData;
    imageType;
    fileId;
    filePath;
    fileType;
    fileImage;
    fileUrl;
    showPreView;
    trainingStatus;
    paramsToSend: any = {};
    isCollapsed: boolean = true;
    @Input() text: string;
    limit: number = 100;
    truncating = true;
    agree: boolean = false;
    courseId;
    courseName;
    trainingClassName;
    trainingClassId;
    uploadPath;
    status;
    currentUser;
    prevBtn;
    options : InAppBrowserOptions = {
        location : 'yes',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };

    constructor(public navCtrl: NavController,public storage: Storage,public iab:InAppBrowser,private http:HttpProvider,public navParams: NavParams, public constant: Constant, public alertCtrl: AlertController, private toastr: ToastrService) {
        this.Math = Math;
        this.detailObject = this.navParams.data;
        this.trainingClassName = this.detailObject['setData'].trainingClassName;
        this.trainingClassId = this.detailObject['setData'].trainingClassId;
        this.courseId = this.detailObject['setData'].CourseTrainingClassMaps[0].Course.courseId;
        this.courseName = this.detailObject['setData'].CourseTrainingClassMaps[0].Course.courseName;
        this.trainingDatas = this.detailObject['setData'].FileMappings;
        this.uploadPath = this.detailObject['uploadPath'];
        this.status= this.detailObject['status'];
        this.lastIndexs = this.trainingDatas.length - 1;
        this.selectedIndexs = this.detailObject['selectedIndex'];
        this.trainingStatus = this.detailObject.status;
        this.loadingBarWidth = (100 / parseInt(this.trainingDatas.length, 10));
        this.quizBtn = (this.initial === this.lastIndexs) ? true : false;
    }

      ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
            }
        });
      }
      
    //  disableSeeking(){
    //      alert('xscsdjk')
    //      var video = <HTMLMediaElement>document.getElementById('video-width');;
    //      console.log(video);
    //      var supposedCurrentTime = 0;
    //      video.addEventListener('timeupdate', function() {
    //          if (!video.onseeking) {
    //              supposedCurrentTime = video.currentTime;
    //          }
    //      });
    //      // prevent user from seeking
    //      video.addEventListener('seeking', function() {
    //          // guard agains infinite recursion:
    //          // user seeks, seeking is fired, currentTime is modified, seeking is fired, current time is modified, ....
    //          var delta = video.currentTime - supposedCurrentTime;
    //          if (Math.abs(delta) > 0.01) {
    //              console.log("Seeking is disabled");
    //              video.currentTime = supposedCurrentTime;
    //          }
    //      });
    //      // delete the following event handler if rewind is not required
    //      video.addEventListener('ended', function() {
    //          // reset state in order to allow for rewind
    //          supposedCurrentTime = 0;
    //      });
         
    //  }

    public openWithSystemBrowser(url : string){
        let target = "_system";
        this.iab.create(url,target,this.options);
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
        this.prevBtn = this.initial == 0 ? true : false;
        this.setTraining = this.trainingDatas[0].File;
        this.fileId = this.setTraining.fileId;
        this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
        this.text = this.setTraining.fileDescription;
    }
    
    // go to quiz page for training details
    goToQuizPage() {
        let self = this;
          this.http.get(API_URL.URLS.quizAPI + '?trainingClassId=' + this.trainingClassId + '&courseId=' + this.courseId).subscribe((res) => {
            if (res['isSuccess']) {
                this.quizData =res['data']['quiz'];     
                if(this.quizData){
                const alert = this.alertCtrl.create({
                    title: 'Are you ready to take the Quiz ?',
                    buttons: [{
                        text: 'Later',
                        role: 'later',
                        handler: () => {
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            self.paramsData['trainingClassId'] = self.trainingClassId;
                            self.paramsData['courseId'] = self.courseId;
                            self.paramsData['menu'] = self.trainingClassName;
                            self.paramsData['quizData'] = self.quizData;
                            self.paramsData['courseName'] = self.courseName;
                            self.navCtrl.push(QuizPage, self.paramsData);
                        }
                    }]
                });
                alert.present();
            }else{
                this.toastr.error('No Questions available.');
            }
         }
     });
    }
   
   //Call after watching video file.
    videoEnded(){
        let userId = this.currentUser ? this.currentUser.userId : 8;
        let data={
        'courseId' :this.courseId,
        'trainingClassId' :  this.trainingClassId,
        'fileId' : this.fileId,
        'userId' : userId,
        'status': "completed"
        }
        this.http.put(false,API_URL.URLS.fileTrainingStatus, data).subscribe((res) => {
        
        },(err) => {
        });
    }
    completedViewOperation(fileId){
        let userId = this.currentUser ? this.currentUser.userId : 8;
        let data={
        'courseId' :this.courseId,
        'trainingClassId' :  this.trainingClassId,
        'fileId' : fileId,
        'userId' : userId,
        'status': "completed"
        }
        this.http.put(false,API_URL.URLS.fileTrainingStatus, data).subscribe((res) => {       
        },(err) => {
        });

    }

    videoFailed(event){
        console.log(event, "failed");        
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

    //go to next file
    showNextPage() {
        this.initial = this.initial + 1;
        this.setTraining = this.trainingDatas[this.initial].File;
        this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
        let ext = this.setTraining.fileUrl.split('.').pop();
        if(ext == "mp4" && this.videotag){
        const htmlVideoTag = this.videotag.nativeElement;
        htmlVideoTag.load();
        }
        this.fileId = this.setTraining.fileId;
        this.text = this.setTraining.fileDescription;
        this.quizBtn = (this.initial === this.lastIndexs) ? true : false;
        this.prevBtn = this.initial == 0 ? true : false;
    }

    //go to previous file
    goBackLevel() {
        if (this.initial === 0) {
            this.goBackToDetailPage();
        } else {
            this.initial = this.initial - 1;
            this.setTraining = this.trainingDatas[this.initial].File;
            this.fileId = this.setTraining.fileId;
            this.text = this.setTraining.fileDescription;
            this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
            let ext = this.setTraining.fileUrl.split('.').pop();
            if(ext == "mp4" && this.videotag){
                const htmlVideoTag = this.videotag.nativeElement;
                htmlVideoTag.load();
            }
            this.prevBtn = this.initial == 0 ? true : false;
            this.quizBtn = (this.initial === this.lastIndexs) ? true : false;
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
                this.fileType = fileType;
                break;
            case "txt":
                fileLink = "assets/imgs/text.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "doc":
                fileLink = "assets/imgs/doc.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "docx":
                fileLink = "assets/imgs/doc.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "ppt":
                fileLink = "assets/imgs/ppt.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "xlsx":
                 fileLink = 'assets/imgs/xlsx.png';
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            case "xls":
                 fileLink = 'assets/imgs/xlsx.png';
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            case "png" :
                fileLink = this.uploadPath + filename;
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "jpg" :
                 fileLink = this.uploadPath + filename;
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            default:
                fileLink = this.uploadPath + filename;
                this.imageType = false;
                this.filePath = filename;
                this.fileType = fileType;
        }
       
        return fileLink;
    }
    viewContent(setTraining,filePath) {
        let docFile = filePath;
        let docFileId = setTraining.fileId;
            let docType;
            let rootUrl = '';
            switch (this.fileType) {
                case "pdf":
                    docType = 'application/pdf';
                    break;
                case 'ppt':
                    docType = 'application/vnd.ms-powerpoint';
                    break;
                case 'pptx':
                    docType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
                    break;
                case 'doc':
                    docType = 'application/msword';
                    rootUrl = 'https://docs.google.com/gview?embedded=true&url=';
                    break;
                case 'docx':
                    docType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    rootUrl = 'https://docs.google.com/gview?embedded=true&url=';
                    break;
                case 'txt':
                    docType = 'text/plain';
                    break;
                default:
                    docType = 'application/pdf';
            }
               let baseUrl = rootUrl+this.uploadPath;
               
            //  console.log(baseUrl + docFile);
            //  debugger;
             this.openWithSystemBrowser(baseUrl+docFile);
             this.completedViewOperation(docFileId);	
        }

}
