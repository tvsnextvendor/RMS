import { Component, OnInit,TemplateRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Constant } from '../../constants/Constant.var';
import { HttpProvider } from '../../providers/http/http';
import { API_URL } from '../../constants/API_URLS.var';
declare var $;

@IonicPage({
  name: 'accomplishment-page'
})
@Component({
  selector: 'page-accomplishment',
  templateUrl: 'accomplishment.html',
  providers: [Constant]
})
export class AccomplishmentPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: Constant,private modalService: BsModalService,private http:HttpProvider,public API_URL:API_URL) {
  }
  modalRef: BsModalRef;
  certificateList:any=[];
  badgeList:any=[];
  badgeSubImage;
  certificateDetail:any={};
  openModal(certificatetemplate: TemplateRef<any>,item) {
    this.modalRef = this.modalService.show(certificatetemplate);
    this.certificateDetail = item;
    //console.log(this.certificateDetail);
    // debugger;
  }
  openBadgeModal(badgetemplate: TemplateRef<any>,item) {
    this.modalRef = this.modalService.show(badgetemplate);
    this.badgeSubImage = item.badgeSubImage;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccomplishmentPage');
  }
  ngOnInit() {
    this.formCarosuel();
    this.getCertificates();
  }
  formCarosuel() {
    $('#carouselExample').on('slide.bs.carousel', function (e) {
      var $e = $(e.relatedTarget);
      var idx = $e.index();
      var itemsPerSlide = 4;
      var totalItems = $('.carousel-item').length;
      console.log(totalItems);
      if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
          // append slides to end
          if (e.direction == "left") {
            $('.carousel-item').eq(i).appendTo('.carousel-inner');
          }
          else {
            $('.carousel-item').eq(0).appendTo('.carousel-inner');
          }
        }
      }
    });
    $('#badgecarouselExample').on('slide.bs.carousel', function (e) {
      var $e = $(e.relatedTarget);
      var idx = $e.index();
      var itemsPerSlide = 4;
      var totalItems = $('.carousel-item').length;
      console.log(totalItems);
      if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
          // append slides to end
          if (e.direction == "left") {
            $('.carousel-item').eq(i).appendTo('.carousel-inner');
          }
          else {
            $('.carousel-item').eq(0).appendTo('.carousel-inner');
          }
        }
      }
    });
  }
  getCertificates(){

    this.http.getData(API_URL.URLS.getCertificates).subscribe((data) => {
      if (data['isSuccess']) {
        this.certificateList = data['certificateList'];
        this.badgeList =data['badgeList'];
      }
    });

  }
}
