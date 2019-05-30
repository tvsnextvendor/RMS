import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { Storage } from '@ionic/storage';
import { LoaderService, SocketService, SanitizeHtmlPipe } from '../../service';

@IonicPage({
  name: 'accomplishment-page'
})
@Component({
  selector: 'page-accomplishment',
  templateUrl: 'accomplishment.html',
  providers: [Constant]
})
export class AccomplishmentPage implements OnInit {

  @ViewChild('sliderOne') sliderOne: Slides;
  @ViewChild('sliderTwo') sliderTwo: Slides;
  constructor(public navCtrl: NavController,public storage:Storage,public socketService: SocketService,public navParams: NavParams, public constant: Constant, private modalService: BsModalService, private http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {

  }
  modalRef: BsModalRef;
  certificateList: any = [];
  badgeList: any = [];
  badgeSubImage;
  certificateDetail: any = {};
  leftButton: boolean = true;
  rightButton: boolean = true;
  SlidePerPage = 2;
  badgeslide = 3;
  badgeLftBtn: boolean = true;
  badgeRigBtn: boolean = true;
  badgeDetails;
  notificationCount;
  showSearchBar: boolean = false;
  search;
  currentUser;

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccomplishmentPage');
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
            let self = this;
            this.storage.get('currentUser').then((user: any) => {
            if (user) {
             self.currentUser = user;
              this.getNotification();
              this.userCertificates();
            }
        });
  }

  ionViewDidEnter() {
    //this.getCertificates();
  }
  onSlideCertChanged() {
    this.certNavigationButton();
  }
  onSlideBadgeChanged() {
    this.badgeNagButton();
  }
  certNavigationButton() {
    let currentIndex = this.sliderOne.getActiveIndex();
    let totalIndex = currentIndex + this.SlidePerPage;
    let totalItems = this.certificateList.length;

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
  badgeNagButton() {
    let currentIndex = this.sliderTwo.getActiveIndex();
    let totalIndex = currentIndex + this.badgeslide;
    let totalItems = this.badgeList.length;
    if (currentIndex === 0) {
      this.badgeLftBtn = false;
      this.badgeRigBtn = true;
    } else if (totalItems === totalIndex) {
      this.badgeLftBtn = true;
      this.badgeRigBtn = false;
    } else {
      this.badgeLftBtn = true;
      this.badgeRigBtn = true;
    }
  }

   getNotification(){
    let userId = this.currentUser.userId;
    let socketObj = {
      userId : userId
    };
   this.socketService.getNotification(socketObj).subscribe((data)=>{
       this.notificationCount = data['unReadCount'];
   });
  }

  openModal(certificatetemplate: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(certificatetemplate);
    this.certificateDetail = item;
    this.modalRef.setClass('certificate-popup');
  }
  openBadgeModal(badgetemplate: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(badgetemplate);
    this.badgeDetails = item;
    this.modalRef.setClass('badge-popup');
  }
  // getCertificates() {
  //   this.loader.showLoader();
  //   this.http.getData(API_URL.URLS.getCertificates).subscribe((data) => {
  //     this.loader.hideLoader();
  //     if (data['isSuccess']) {
  //       this.certificateList = data['certificateList'];
  //       this.badgeList = data['badgeList'];
  //     }
  //   });
  // }

  userCertificates(){
    this.http.get(API_URL.URLS.certificates+'?userId='+this.currentUser.userId).subscribe((res)=>{
      if(res['isSuccess']){
         this.certificateList = res['data'];
      }
    })
  }
  
  goToNotification() {
    this.navCtrl.setRoot('notification-page');
  }

   goToForum(){
     this.navCtrl.setRoot('forum-page');
  }
}
