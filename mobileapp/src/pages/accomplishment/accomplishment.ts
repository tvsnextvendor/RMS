import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
import { LoaderService } from '../../service/loaderService';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant, private modalService: BsModalService, private http: HttpProvider, public API_URL: API_URL,public loader:LoaderService) {

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
  showSearchBar: boolean = false;
  search;

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccomplishmentPage');
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getCertificates();
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
  getCertificates() {
    this.loader.showLoader();
    this.http.getData(API_URL.URLS.getCertificates).subscribe((data) => {
      this.loader.hideLoader();
      if (data['isSuccess']) {
        this.certificateList = data['certificateList'];
        this.badgeList = data['badgeList'];
      }
    });
  }
  toggleSearchBox() {
    this.showSearchBar = !this.showSearchBar;
  }
  onInput($e) {
    console.log("On input");
    console.log($e);
    console.log(this.search);
    if (this.search != '') {

      console.log("On input if");
      this.certificateList = [];
      this.badgeList = [];
      /*this.certificateList = this.certificateList.filter(val => val.forumName === this.search);*/
    } else {
      console.log("On input else");
      this.showSearchBar = false;
      this.getCertificates();
    }
    console.log(this.certificateList);
  }
  onCancel($e) {
    console.log("On Cancel");
    this.showSearchBar = false;
    this.getCertificates();
    console.log($e);
  }
}
