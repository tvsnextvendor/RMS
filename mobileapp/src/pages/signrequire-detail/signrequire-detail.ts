import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import {ToastrService, CommonService} from '../../service';
import { API } from '../../constants/API.var';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/http/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';


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
  showToastr;
  msgTitle;
  msgDes;
  className;
  currentUser;
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
  
 
  constructor(public navCtrl: NavController,public commonService:CommonService,public iab:InAppBrowser,public http: HttpProvider,public toastr: ToastrService, public navParams: NavParams,public storage: Storage,public constant:Constant) {
          let data = this.navParams.data;
          this.Files = data.files;
          this.notificationFileId = data.notificationFileId;
          this.uploadPath = data.uploadPath;
          this.pageType = data.type;
  }

  ionViewDidLoad() {
    this.showPreView = this.getFileExtension(this.Files.fileUrl);
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
            case "docx":
            case "doc" :
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
            case "png" :
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
                this.contentViewed = true; 
                this.imageType = false;
                this.filePath = filename;
                this.fileType = fileType;
        }
       
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
          if(this.agree){
          this.navCtrl.push('course-page','signReq');
          }else{
            this.successMessage('Please agree acknowledgement');
          }
      }else{
          this.completeNotification();
          this.navCtrl.push('generalnotification-page');
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
            let docType;
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
                    break;
                case 'docx':
                    docType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                case 'txt':
                    docType = 'text/plain';
                    break;
                default:
                    docType = 'application/pdf';
            }
             let baseUrl = this.uploadPath;
             console.log(baseUrl + docFile)
             this.openWithSystemBrowser(baseUrl + docFile);
     }

  
         openWithSystemBrowser(url : string){
            let baseUrl = this.uploadPath;
            let target = "_system";
            this.iab.create(url,target,this.options);
        }

      

 

}
