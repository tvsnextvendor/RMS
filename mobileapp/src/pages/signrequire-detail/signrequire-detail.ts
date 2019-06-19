import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constant } from '../../constants/Constant.var';
import {ToastrService} from '../../service/toastrService';
import { API } from '../../constants/API.var';


@IonicPage({
    name: 'signrequire-page'
})

@Component({
  selector: 'page-signrequire-detail',
  templateUrl: 'signrequire-detail.html',
})

export class SignrequireDetailPage {
  
  @ViewChild("videoTag") videotag: ElementRef;
  Files;
  imageType;
  filePath;
  fileType;
  truncating = true;
  showPreView;
  uploadPath;
  pageType;
  agree: boolean = false;
 
  constructor(public navCtrl: NavController,public toastr: ToastrService, public navParams: NavParams, public constant:Constant) {
          let data = this.navParams.data;
          this.Files = data.files;
          this.uploadPath = data.uploadPath;
          this.pageType = data.type;

  }

  ionViewDidLoad() {
    this.showPreView = this.getFileExtension(this.Files.fileUrl);
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
            case "png" :
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

    goBack(){
      if(this.pageType == 'signReq'){
          if(this.agree){
          this.navCtrl.setRoot('course-page','signReq');
          }else{
            this.toastr.error("Please agree acknowledgement");
          }
      }else{
          this.navCtrl.setRoot('generalnotification-page');
      }
    }

     viewContent(docFile) {
        // allowed files PPT, .TXT, MP4, .JPG, .DOC, MPEG, AVI
        // Doc Viewed Files PPT,TXT,DOC
        if (this.agree) {
            // const options: DocumentViewerOptions = {
            //     title: this.trainingClassName
            // };
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
             let target = '_blank';
             window.open(baseUrl + docFile, target);	
        }else {
            this.toastr.error("Please agree acknowledgement to view content"); return false;
        }
     }


}
