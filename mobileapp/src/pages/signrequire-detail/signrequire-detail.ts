import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular'; 
import { Constant } from '../../constants/Constant.var';
import {ToastrService, CommonService} from '../../service';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/http/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';



@IonicPage({
    name: 'signrequire-page'
})

@Component({
  selector: 'page-signrequire-detail',
  templateUrl: 'signrequire-detail.html',
  providers: [InAppBrowser]
})

export class SignrequireDetailPage {
  
  @ViewChild("videoTag") videotag: ElementRef;
  Files;
  imageType;
  filePath;
  fileType;
  truncating = true;
  notificationFileId;
  showPreView;
  uploadPath;
  pageType;
  videoFormat;
  showToastr;
  msgTitle;
  msgDes;
  className;
  currentUser;
  description;
  fileStatus;
  contentViewed: boolean = false;
  agree: boolean = false;
  hideWarning: boolean = false;
  options: InAppBrowserOptions = {
      location: 'yes',//Or 'no' 
      hidden: 'no', //Or  'yes'
      clearcache: 'yes',
      clearsessioncache: 'yes',
      zoom: 'yes',//Android only ,shows browser zoom controls 
      hardwareback: 'yes',
      mediaPlaybackRequiresUserAction: 'no',
      shouldPauseOnSuspend: 'no', //Android only 
      closebuttoncaption: 'Close', //iOS only
      disallowoverscroll: 'no', //iOS only 
      toolbar: 'yes', //iOS only 
      enableViewportScale: 'no', //iOS only 
      allowInlineMediaPlayback: 'no',//iOS only 
      presentationstyle: 'pagesheet',//iOS only 
      fullscreen: 'yes',//Windows only    
  };
  
 
  constructor(public navCtrl: NavController,public commonService:CommonService,public iab:InAppBrowser,public http: HttpProvider,public toastr: ToastrService, public navParams: NavParams,public storage: Storage,public constant:Constant,private document: DocumentViewer,public platform: Platform) {
          let data = this.navParams.data;
          this.Files = data.files ? data.files : {};
          this.notificationFileId = data.notificationFileId;
          this.fileStatus = data.fileStatus;
          console.log(data,"DATA");
          this.uploadPath = data.uploadPath ? data.uploadPath : '';
          this.pageType = data.type;
          this.description = data.description;
  }

  ionViewDidLoad() {
    if(!this.description){
    this.showPreView = this.getFileExtension(this.Files.fileUrl);
    }else{
     this.showPreView = "assets/imgs/banner.png";
     this.imageType = true;
     //this.Files.fileDescription = this.description;
    }

  }

  ionViewDidEnter(){
        if(!this.imageType){
         var video = <HTMLMediaElement>document.getElementById('video-width');;
         var supposedCurrentTime = 0;
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

  ngAfterViewInit(){
             let self = this;
             this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
            }
        });
  }
  
    getFileExtension(filename) {
        let ext = /^.+\.([^.]+)$/.exec(filename);
        let fileType = ext == null ? "" : ext[1].toLowerCase();
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
            case "pptx":
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
                fileLink = this.uploadPath + filename;
                this.contentViewed = true;
                this.imageType = false;
                this.filePath = filename;
                this.fileType = fileType;
                this.videoFormat = fileType == 'ogv' ? "video/ogg" : "video/" + fileType; // for ogv file also video format should be video/ogg.
        }
        //this.restrictForward();
        return fileLink;
    }

  successMessage(msg){
    this.showToastr = true;
    this.className = "notify-box alert alert-error";
    this.msgTitle = "Error";
    this.msgDes = msg ;
    let self = this;
    setTimeout(function(){ 
      self.showToastr = false;
      }, 3000); 
  }

    doneClicked(){
      if(this.pageType == 'signReq'){
          if(this.agree && this.contentViewed){
                let paramsData = {};
                paramsData['tab'] = 'signReq'
                this.navCtrl.push('course-page', paramsData);
          }else{
            this.successMessage('Please view the content and acknowledge that you have read the document by clicking on the check box');
          }
      }else{
      if(this.contentViewed){
          this.completeNotification();
          this.navCtrl.push('generalnotification-page');
      }else{
          this.successMessage('Please view the content');
      }
      }
    }

    goBack(){
        if (this.pageType == 'signReq') {
              let paramsData ={};
                paramsData['tab'] = 'signReq'
                this.navCtrl.push('course-page', paramsData);
        } else {
            this.navCtrl.push('generalnotification-page');
        }
    }

    completeNotification(){
       this.hideWarning = true;
       let userId =  this.currentUser.userId;
       let resortId = this.currentUser.ResortUserMappings[0].resortId;
       let postData={
         userId : userId,
         resortId: resortId,
         notificationFileId: this.notificationFileId
       }
      this.http.put(false,API_URL.URLS.completedNotification,postData).subscribe(res=>{

      })
    }

     viewContent(docFile) { 
         this.contentViewed = true; 
           if(this.description){
               let postData = {
                   description: this.description
               }
               this.navCtrl.push('description-page', postData);
           }else{
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
             let baseUrl = rootUrl+this.uploadPath+docFile;
             console.log(baseUrl + docFile)
            // this.openWithSystemBrowser(baseUrl + docFile);

            this.platform.ready().then(() => {
            
            
                if (this.platform.is('android') || this.platform.is('mobileweb')) {
                    //  this.openWithSystemBrowser(baseUrl, setTraining.fileId);
                    //  console.log("running on Android device!");
                    let platformPath = 'file:///android_asset/www/';
                    if (this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'ppt' || this.fileType === 'pptx') {
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = baseUrl;
                        link.click();
                        this.openDocView1(this.filePath, docType, platformPath);
                    } else {
                        this.openemptyInAppBrowser(baseUrl);
                    }
                }
                if (this.platform.is('ios')) {
                    //For IOS platform
                    let platformPath = location.href.replace("/index.html", "");
                    //  this.openWithCordovaBrowser(baseUrl, setTraining.fileId);
                    //  console.log("running on iOS device!");
                    if (this.fileType === 'xls' || this.fileType === 'xlsx' || this.fileType === 'ppt' || this.fileType === 'pptx') {
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = baseUrl;
                        link.click();
                        this.openDocView1(this.filePath, docType, platformPath);
                    } else {
                        this.openWithCordovaBrowser(baseUrl);
                    }
                }
                if (this.platform.is('browser') || this.platform.is('desktop') || this.platform.is('core')) {
                    console.log("BROWSER");
                    this.openWithSystemBrowser(baseUrl);
                }
            }); 

           }
     }
  
    

        public openWithCordovaBrowser(url : string){
            console.log(url,"CBURL");
            
            let target = "_self";
            this.iab.create(url,target,this.options);
        }  

        //Open file content in browser  
        public openWithSystemBrowser(url : string){
            console.log(url, "SBURL");
            let target = "_system";
            this.iab.create(url,target,this.options);
        }

        public openemptyInAppBrowser(url: string) {
            console.log(url, "IAURL");
                        this.iab.create(url);
        }

     
     openDocView1(fileName, fileMIMEType, platformPath) {
                console.log(fileName, "OPD");
                let setPath = platformPath + fileName;
                const options: DocumentViewerOptions = {
                title: 'test files'
                };
                this.document.viewDocument(setPath, fileMIMEType, options);
    }
     


   
}
