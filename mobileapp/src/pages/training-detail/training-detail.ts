import { Component, ViewChild, Input ,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { QuizPage } from '../quiz/quiz';
import { QuizResultPage } from '../quiz-result/quiz-result';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular'; 
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
    noQuiz:boolean = false;
    leftButton: boolean = true;
    rightButton: boolean = true;
    btnDisable : boolean = false;
    videoMenuTitle = "";
    currentVideoIndex = 0;
    loadingBarWidth = 0;
    Math: any;
    userId;
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
    timerArr = [];
    paramsToSend: any = {};
    isCollapsed: boolean = true;
    @Input() text: string;
    limit: number = 100;
    truncating = true;
    agree: boolean = false;
    quizBtnDisable: boolean = false;
    courseId;
    trainingClassId;
    uploadPath;
    imagePath;
    status;
    currentUser;
    resortId;
    prevBtn;
    className;
    feedback;
    showToastr = false;
    msgTitle;
    msgDes;
    allTrainingClasses;
    allTrainingClassesCount;
    options : InAppBrowserOptions = {
        location : 'no',//Or 'no' 
        footer : 'yes',
        hidden : 'yes', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'yes',//Android only ,shows browser zoom controls 
        hardwareback : 'yes',
        lefttoright:'yes',
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

    timeBegan = null
    timeStopped:any = null
    stoppedDuration:any = 0
    started = null
    running = false
    blankTime = "00:00.000"
    time = "00:00.000"
    perAfterView = 0;
    fileIdsArr=[];
    timeArr=[];

    constructor(public navCtrl: NavController,public platform:Platform,public storage: Storage,public iab:InAppBrowser,private http:HttpProvider,public navParams: NavParams, public constant: Constant, public alertCtrl: AlertController) {
        this.Math = Math;
        this.detailObject = this.navParams.data;
        this.status= this.detailObject['status'] ? this.detailObject['status'] : '' ;
    }

      ionViewWillEnter() {
          this.quizBtnDisable = false;
            let self = this;
             this.storage.get('timer').then((det: any) => {
                if (det) {
                    console.log(det,"DETAIL FILTER");
                    let data = det.filter(x => x.trainingClassId === this.detailObject.trainingClassId);
                    if(data.length){
                        this.stoppedDuration = data[0].stoppedDuration;
                        this.timeBegan = data[0].timeBegan;
                        this.timeStopped = data[0].timeStopped;
                    }
                }
            });
            this.storage.get('currentUser').then((user: any) => {
                if (user) {
                    self.currentUser = user;
                    self.resortId = self.currentUser.ResortUserMappings[0].resortId;
                    self.userId = self.currentUser ? self.currentUser.userId : '';
                    this.getCourseTrainingClasses();
                    this.start();
                }
            });        
      }

        getCourseTrainingClasses() {
            let self = this;
            return new Promise(resolve => {
            this.http.get(API_URL.URLS.trainingClassFilesAPI+'?trainingClassId='+this.detailObject.trainingClassId+'&trainingScheduleId='+this.detailObject.trainingScheduleId+'&resortId='+ this.resortId +'&userId='+this.userId+'&type='+'mobile').subscribe((res) => {
                if(res['isSuccess']){
                self.feedback = res['data']['feedback'];
                self.allTrainingClasses = res['data']['file'];  
                self.status = self.detailObject['setData']['typeSet'] == 'Class' ? ( (self.feedback.length  && self.feedback[0].status) ? self.feedback[0].status : 'inProgress' )  : self.detailObject['status'];
                if(res['data']['quiz'].length == 0){
                   self.noQuiz = true;
                }
                self.allTrainingClassesCount = res['data']['file'].length;
                self.lastIndexs = self.allTrainingClassesCount - 1;
                self.quizBtn = (self.initial === self.lastIndexs) ? true : false;
                self.detailObject['setData']['passPercentage'] = this.detailObject['setData']['typeSet'] == 'Class' ? ( res['data'].schedulePercentage.length ? res['data'].schedulePercentage[0].passPercentage: '') : self.detailObject['setData']['passPercentage'] ;
                self.detailObject['setData']['trainingClassName'] = self.allTrainingClasses[0].TrainingClass.trainingClassName;
                this.loadingBarWidth = (100 / parseInt(self.allTrainingClasses.length, 10));
                self.imagePath = res['data']['uploadPaths']['uploadPath'];
                this.loadFirstFile();
                //this.disableSeeking();
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
        this.prevBtn = this.initial == 0 ? true : false;
        this.setTraining = this.allTrainingClasses[0].File;
        this.uploadPath = this.setTraining.transcodeUrl ? this.setTraining.transcodeUrl : (this.setTraining.inputUrl ?  this.setTraining.inputUrl : this.imagePath + this.setTraining.fileUrl) ;
        this.fileId = this.setTraining.fileId;
        this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
        let ext = this.setTraining.fileUrl.split('.').pop();
        if (ext == "mp4" && this.videotag) {
            const htmlVideoTag = this.videotag.nativeElement;
            htmlVideoTag.load();
        }
        this.text = this.setTraining.fileDescription;
        setTimeout(() => {
          this.disableSeeking();
        }, 2000);
     }

      disableSeeking(){
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
    public openWithSystemBrowser(url : string, fileId : string){
        let target = "_system";
        this.iab.create(url,target,this.options);
        this.calculatePercentage(fileId);
    }

   
    public openWithCordovaBrowser(url : string, fileId : string){
        let target = "_self";
        this.iab.create(url,target,this.options);
        this.calculatePercentage(fileId);
    }  

      public openWithInAppBrowser(url : string, fileId: string){
        let target = "_blank";
        this.iab.create(url,target,this.options);
        this.calculatePercentage(fileId);
        
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
        let data = {
            'trainingClassId': this.detailObject.trainingClassId,
            'userId': this.userId,
            'resortId': this.resortId
        }
        let courseAssign = (this.detailObject.courseId)?{ 'courseId' :this.detailObject.courseId}:{};
        data = Object.assign(data,courseAssign);
        this.http.put(false, API_URL.URLS.checkFileComplete, data).subscribe((res) => {
            if(res['isSuccess']){
                if(res['data']['statusKey'] == false){
                     this.toastrMsg(res.message, "error");
                }else{
                    if (this.videotag) {
                        const htmlVideoTag = this.videotag.nativeElement;
                        htmlVideoTag.pause();
                    }
                  let self = this;
                  const data = this.detailObject;
                  let query = data.courseId ? '?trainingClassId=' + data.trainingClassId + '&courseId=' + data.courseId : '?trainingClassId=' + data.trainingClassId;
                  this.http.get(API_URL.URLS.quizAPI + query).subscribe((res) => {
                      if (res['isSuccess']) {
                          this.quizData = res['data']['quiz'];
                          if (!this.quizBtnDisable) {
                              self.quizBtnDisable = true;
                              const alert = this.alertCtrl.create({
                                  title: 'Are you ready to take the Quiz ?',
                                  buttons: [{
                                      text: 'Later',
                                      role: 'later',
                                      handler: () => {
                                          self.quizBtnDisable = false;
                                      }
                                  },
                                  {
                                      text: 'Yes',
                                      handler: () => {
                                          self.stop();
                                          self.paramsData['quizData'] = self.quizData;
                                          self.paramsData['setData'] = this.detailObject['setData'];
                                          self.paramsData['setData']['trainingClassId'] = this.detailObject['trainingClassId'];
                                          self.paramsData['scheduleId'] = this.detailObject['scheduleId'] ? this.detailObject['scheduleId'] : this.detailObject['trainingScheduleId'],
                                          self.paramsData['timeStopped'] = self.timeStopped,
                                          self.paramsData['timeBegan'] = self.timeBegan,
                                          self.paramsData['stoppedDuration'] = self.stoppedDuration
                                        //   self.paramsData['time']  = self.time

                                              self.navCtrl.push(QuizPage, self.paramsData);
                                      }
                                  }]
                              });
                              alert.present();
                          }
                        //   } else {
                        //       this.toastr.error('No Questions available.');
                        //   }
                      }
                  });
                }
            }});
    }
   
   //Call after watching video file.
    videoEnded(){
        let data={
        'courseId' :this.detailObject.courseId,
        'trainingClassId' :  this.detailObject.trainingClassId,
        'fileId' : this.fileId,
        'userId' : this.userId,
        'status': "completed"
        }
        this.calculatePercentage(this.fileId);
        this.http.put(false,API_URL.URLS.fileTrainingStatus, data).subscribe((res) => {
        
        },(err) => {
        });
    }

    //After view content
    completedViewOperation(fileId){
        let data={
        'courseId' :this.detailObject['setData'].courseId,
        'trainingClassId' :  this.detailObject['setData'].trainingClassId,
        'fileId' : fileId,
        'userId' : this.userId,
        'status': "completed"
        }
        this.http.put(false,API_URL.URLS.fileTrainingStatus, data).subscribe((res) => {       
        },(err) => {
        });
    }


    readMoreLess(){
        this.truncating = !this.truncating;
    }

    videoFailed(event){
        //console.log(event, "failed");        
    }
 
    // Check files and videos of training class are completed or not while clicking done btn atlast.
    checkCompleteorNot(){
        let data = {
            'trainingClassId': this.detailObject.trainingClassId,
            'userId': this.userId,
            'resortId': this.resortId
        }
        let courseAssign = (this.detailObject.courseId)?{ 'courseId' :this.detailObject.courseId}:{};
        data = Object.assign(data,courseAssign);
        this.http.put(false, API_URL.URLS.checkFileComplete, data).subscribe((res) => {
            if(res['isSuccess']){
                if(res['data']['statusKey'] == false){
                     this.toastrMsg(res.message, "error")
                }else{
                   const resultData = {
                       "courseId": this.detailObject['setData'].courseId,
                       "trainingClassId": this.detailObject.trainingClassId,
                       "setData" : this.detailObject['setData'],
                       "scheduleId": this.detailObject['trainingScheduleId'] ? this.detailObject['trainingScheduleId'] : this.detailObject['scheduleId'],
                       "trainingClassName": this.detailObject['setData'].trainingClassName,
                       "courseName": this.detailObject['setData'].courseName,
                       "status": "noQuiz",
                       "timeTaken":this.time
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
    goBackToDetailPage(){
        this.paramsToSend['status'] = this.trainingStatus;
        this.navCtrl.pop(this.paramsToSend);
        this.stop();
        this.storage.get('timer').then(value =>{
          if(value){
               console.log(value,"VALUE FILTER");
                let data = value.filter(x => { 
                    return  x.trainingClassId != this.detailObject.trainingClassId
                });    
                let obj = {
                    'timeStopped': this.timeStopped,
                    'timeBegan': this.timeBegan,
                    'stoppedDuration': this.stoppedDuration,
                    'trainingClassId': this.detailObject.trainingClassId
                };
                data.push(obj);
                this.storage.set('timer', data);
          }else{        
                let obj = {
                    'timeStopped': this.timeStopped,
                    'timeBegan': this.timeBegan,
                    'stoppedDuration': this.stoppedDuration,
                    'trainingClassId': this.detailObject.trainingClassId
                };
                this.timerArr.push(obj);
                this.storage.set('timer', this.timerArr);
          }
        })
    }

    checkNavigationButton(){
        let currentIndex = this.slides.getActiveIndex();
        this.currentVideoIndex = currentIndex;
        let totalIndex = currentIndex + parseInt('1');
        let totalItems = this.allTrainingClasses.length;
        this.videoMenuTitle = this.allTrainingClasses[currentIndex]['fileTitle'];
        if (currentIndex === 0){
            this.leftButton = false;
            this.rightButton = true;
        }else if(totalItems === totalIndex){
            this.leftButton = true;
            this.rightButton = false;
        }else{
            this.leftButton = true;
            this.rightButton = true;
        }
    }

    //go to next file
    showNextPage() {
        this.initial = this.initial + 1;
        this.truncating = true;
        this.setTraining = this.allTrainingClasses[this.initial].File;
        this.uploadPath = this.setTraining.transcodeUrl ? this.setTraining.transcodeUrl : (this.setTraining.inputUrl ? this.setTraining.inputUrl : this.imagePath+this.setTraining.fileUrl);
        this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
        let ext = this.setTraining.fileUrl.split('.').pop();
        if(ext == "mp4" && this.videotag){
        const htmlVideoTag = this.videotag.nativeElement;
        htmlVideoTag.load();
        }
        setTimeout(() => {
            this.disableSeeking();
        }, 2000);
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
            this.truncating = true;
            this.setTraining = this.allTrainingClasses[this.initial].File;
            this.uploadPath = this.setTraining.transcodeUrl ? this.setTraining.transcodeUrl : (this.setTraining.inputUrl ? this.setTraining.inputUrl : this.imagePath + this.setTraining.fileUrl);
            this.fileId = this.setTraining.fileId;
            this.text = this.setTraining.fileDescription;
            this.showPreView = this.getFileExtension(this.setTraining.fileUrl);
            let ext = this.setTraining.fileUrl.split('.').pop();
            if(ext == "mp4" && this.videotag){
                const htmlVideoTag = this.videotag.nativeElement;
                htmlVideoTag.load();
            }
            setTimeout(() => {
                this.disableSeeking();
            }, 2000);
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
            case "avi":
            case "mpg":
            case "jpeg" :
            case "jpg" :
            case "key":
                 //fileLink = this.uploadPath + filename;
                 fileLink = 'assets/imgs/banner.png';
                 this.imageType = true;
                 this.filePath = filename;
                 this.fileType = fileType;
                 break;
            default:
                fileLink = this.uploadPath;
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
                    rootUrl = 'https://docs.google.com/gview?embedded=true&url=';
                    break;
                case 'key':
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
             console.log(baseUrl);
             this.platform.ready().then(() => {
                 if (this.platform.is('android') || this.platform.is('mobileweb')) {
                     this.openWithSystemBrowser(baseUrl, setTraining.fileId);
                     console.log("running on Android device!");
                 }
                 if (this.platform.is('ios')) {
                     this.openWithCordovaBrowser(baseUrl, setTraining.fileId);
                     console.log("running on iOS device!");
                 }
                 if(this.platform.is('browser') || this.platform.is('desktop') || this.platform.is('core')){
                     console.log("BROWSER");
                     this.openWithSystemBrowser(baseUrl, setTraining.fileId);
                 }
             }); 

             this.completedViewOperation(docFileId);	
        }


        //To calculate percentage displaying at loading bar.
        calculatePercentage(fileId){
           let arrLength = this.fileIdsArr.length;
           if(arrLength == 0){
               this.fileIdsArr.push(fileId);
               this.perAfterView = Math.round(this.loadingBarWidth * (arrLength + 1))
           }else{
              if (this.fileIdsArr.indexOf(fileId) !== -1) {
                //   alert("Value exists!")
              } else {
                  this.fileIdsArr.push(fileId);
                  this.perAfterView = Math.round(this.loadingBarWidth * (arrLength + 1));
              }              
           }
        }


     start() {
            if(this.running) return;
            if (this.timeBegan === null) {
                this.reset();
                this.timeBegan = new Date();
            } 
            if (this.timeStopped !== null) {
                let currentTime: any = new Date();
            let newStoppedDuration:any = (currentTime - this.timeStopped)
            this.stoppedDuration = this.stoppedDuration + newStoppedDuration;
            }
            this.started = setInterval(this.clockRunning.bind(this), 10);
            this.running = true;
        }

        stop() {
            this.running = false;
            this.timeStopped = new Date();
            clearInterval(this.started);
         }

       zeroPrefix(num, digit) {
            let zero = '';
            for(let i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
       }

       clockRunning(){
            let currentTime:any = new Date()
            let timeElapsed:any = new Date(currentTime - this.timeBegan - this.stoppedDuration)
            let hour = timeElapsed.getUTCHours()
            let min = timeElapsed.getUTCMinutes()
            let sec = timeElapsed.getUTCSeconds()
            this.time =
            this.zeroPrefix(hour, 2) + ":" +
            this.zeroPrefix(min, 2) + ":" +
            this.zeroPrefix(sec, 2);
        };

       reset() {
            this.running = false;
            clearInterval(this.started);
            this.stoppedDuration = 0;
            this.timeBegan = null;
            this.timeStopped = null;
            this.time = this.blankTime;
      }



}
