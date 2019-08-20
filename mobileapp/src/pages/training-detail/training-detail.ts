import { Component, ViewChild, Input ,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { QuizResultPage } from '../quiz-result/quiz-result';
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
    imageType = false;
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
    trainingClassId;
    uploadPath;
    status;
    currentUser;
    prevBtn;
    className;
    feedback;
    showToastr = false;
    msgTitle;
    msgDes;
    allTrainingClasses;
    allTrainingClassesCount;
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
        // this.trainingClassId = this.detailObject['setData'].trainingClassId;
        // this.courseId = this.detailObject['setData'].CourseTrainingClassMaps[0].Course.courseId;
        // this.trainingDatas = this.detailObject['setData'].FileMappings;
        // this.uploadPath = this.detailObject['uploadPath'];
        this.status= this.detailObject['status'] ? this.detailObject['status'] : '' ;
        console.log(this.status, this.detailObject, "STATUS");
        // console.log(this.detailObject,"STATUS");
        // this.lastIndexs = this.trainingDatas.length - 1;
        // this.selectedIndexs = this.detailObject['selectedIndex'];
        // this.trainingStatus = this.detailObject.status;
        // this.loadingBarWidth = (100 / parseInt(this.trainingDatas.length, 10));
        // this.quizBtn = (this.initial === this.lastIndexs) ? true : false;
    }

      ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
             this.getCourseTrainingClasses();
            }
        });
      
      }


        getCourseTrainingClasses() {
            let self = this;
            let userId = this.currentUser.userId;
            let resortId = this.currentUser.ResortUserMappings[0].resortId;
            return new Promise(resolve => {
            this.http.get(API_URL.URLS.trainingClassFilesAPI+'?trainingClassId='+this.detailObject.trainingClassId+'&trainingScheduleId='+this.detailObject.trainingScheduleId+'&resortId='+ resortId +'&userId='+userId+'&type='+'mobile').subscribe((res) => {
                if(res.isSuccess){
                self.feedback = res['data']['feedback'];
                self.allTrainingClasses = res['data']['file'];        
                self.status = this.detailObject['setData']['typeSet'] == 'Class' ? ( self.feedback.length ? self.feedback[0].status : 'inProgress' )  : this.detailObject['status'];
                if(res['data']['quiz'].length == 0){
                   self.status = 'noQuiz';
                }
                self.allTrainingClassesCount = res['data']['file'].length;
                self.lastIndexs = self.allTrainingClassesCount - 1;
                self.quizBtn = (self.initial === self.lastIndexs) ? true : false;
                self.detailObject['setData']['passPercentage'] = this.detailObject['setData']['typeSet'] == 'Class' ? ( res['data'].schedulePercentage.length ? res['data'].schedulePercentage[0].passPercentage: '') : self.detailObject['setData']['passPercentage'] ;
                self.detailObject['setData']['trainingClassName'] = self.allTrainingClasses[0].TrainingClass.trainingClassName;
                this.loadingBarWidth = (100 / parseInt(self.allTrainingClasses.length, 10));
                this.loadFirstFile();
                self.uploadPath = res['data']['uploadPaths']['uploadPath'];
                resolve('resolved');
                }
            }, (err) => {
                console.log('error occured', err);
                resolve('rejected');
            });
            });
        }


      // first page load
     loadFirstFile() {
         console.log(this.allTrainingClasses)
        this.prevBtn = this.initial == 0 ? true : false;
        this.setTraining = this.allTrainingClasses[0].File;
        this.fileId = this.setTraining.fileId;
        this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
        // this.restrictForward();
        this.text = this.setTraining.fileDescription;
     }

      ionViewDidEnter(){
        console.log(this.imageType);
        //Restrict forward video
        if(!this.imageType){
         var video = <HTMLMediaElement>document.getElementById('video-width');
         var supposedCurrentTime = 0;
         if(video){
         video.ontimeupdate = function() {
             if (video.seeking == false) {
                 supposedCurrentTime = video.currentTime;
             }
         };
         video.onseeking = function() {
            if(video.currentTime > supposedCurrentTime){
             var delta = video.currentTime - supposedCurrentTime;
             if (Math.abs(delta) > 0.01) {
                 video.currentTime = supposedCurrentTime;
             }
            }
         }; 
         }
        }   
      }

    //Open file content in browser  
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
    
    // go to quiz page for training details
    goToQuizPage() {
        if (this.videotag) {
            const htmlVideoTag = this.videotag.nativeElement;
            htmlVideoTag.pause();
        }
        let self = this;
          const data = this.detailObject;
          let query = data.courseId ? '?trainingClassId=' + data.trainingClassId + '&courseId=' + data.courseId : '?trainingClassId=' + data.trainingClassId  ;
          this.http.get(API_URL.URLS.quizAPI + query).subscribe((res) => {
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
                            console.log(this.detailObject['setData'],"SETdcshjb")
                            self.paramsData['quizData'] = self.quizData;
                            self.paramsData['setData']= this.detailObject['setData'];
                            self.paramsData['setData']['trainingClassId'] = this.detailObject['trainingClassId'];
                            self.paramsData['scheduleId']=this.detailObject['scheduleId'],
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
        'courseId' :this.detailObject['setData'].courseId,
        'trainingClassId' :  this.detailObject['setData'].trainingClassId,
        'fileId' : this.fileId,
        'userId' : userId,
        'status': "completed"
        }
        this.http.put(false,API_URL.URLS.fileTrainingStatus, data).subscribe((res) => {
        
        },(err) => {
        });
    }

    //After view content
    completedViewOperation(fileId){
        let userId = this.currentUser ? this.currentUser.userId : 8;
        let data={
        'courseId' :this.detailObject['setData'].courseId,
        'trainingClassId' :  this.detailObject['setData'].trainingClassId,
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
 
    // Check files and videos of training class are completed or not while clicking done btn atlast.
    checkCompleteorNot(){
        let userId = this.currentUser ? this.currentUser.userId : 8;
        let data = {
            'trainingClassId': this.detailObject['setData'].trainingClassId,
            'userId': userId,
        }
        this.http.put(false, API_URL.URLS.checkFileComplete, data).subscribe((res) => {
            if(res.isSuccess){
                if(res.data.statusKey == false){
                     this.toastrMsg(res.data.message, "error")
                }else{
                   const resultData = {
                       "courseId": this.detailObject['setData'].courseId,
                       "trainingClassId": this.detailObject['setData'].trainingClassId,
                       "scheduleId": this.detailObject['trainingScheduleId'],
                       "trainingClassName": this.detailObject['setData'].trainingClassName,
                       "courseName": this.detailObject['setData'].courseName,
                       "status": "noQuiz"
                   };
                    this.navCtrl.push(QuizResultPage, resultData);
                }
            }
        }, (err) => {
        });
    }


    toastrMsg(msg, status){
        this.showToastr = true;
        this.className = status == "success" ?  "notify-box.alert-success" : "notify-box alert alert-error";
        this.msgTitle =status == "success" ? "Success" : "Error";
        this.msgDes = msg ;
        let self = this;
        setTimeout(function(){ 
        self.showToastr = false;
        }, 3000); 
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
        let totalItems = this.allTrainingClasses.length;
        this.videoMenuTitle = this.allTrainingClasses[currentIndex]['fileTitle'];
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
        this.setTraining = this.allTrainingClasses[this.initial].File;
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
            this.setTraining = this.allTrainingClasses[this.initial].File;
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
                fileLink = "assets/imgs/banner.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "txt":
                fileLink = "assets/imgs/banner.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "doc":
                fileLink = "assets/imgs/banner.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "docx":
                fileLink = "assets/imgs/banner.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "ppt":
                fileLink = "assets/imgs/banner.png";
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "xlsx":
                 fileLink = 'assets/imgs/banner.png';
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            case "xls":
                 fileLink = 'assets/imgs/banner.png';
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            case "png" :
                //fileLink = this.uploadPath + filename;
                fileLink = 'assets/imgs/banner.png';
                this.imageType = true;
                this.filePath = filename;
                this.fileType = fileType;
                break;
            case "jpg" :
                 //fileLink = this.uploadPath + filename;
                 fileLink = 'assets/imgs/banner.png';
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
        
        //this.restrictForward();
        return fileLink;
    }

    //View content
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
               
             this.openWithSystemBrowser(baseUrl+docFile);
             this.completedViewOperation(docFileId);	
        }

}
