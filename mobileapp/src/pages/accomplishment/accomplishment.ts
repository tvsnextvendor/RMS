import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
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
    constructor(public navCtrl: NavController, public storage: Storage, public socketService: SocketService, public navParams: NavParams, public constant: Constant, private http: HttpProvider, public API_URL: API_URL, public loader: LoaderService, public sanitizeHtml: SanitizeHtmlPipe) { }

    badgeSubImage;
    badgeDetails;
    notificationCount;
    search;
    currentUser;
    totalPage;
    certificateList: any = [];
    certificateDetail: any = {};
    showSearchBar: boolean = false;
    scrollEnable: boolean = false;
    leftButton: boolean = true;
    rightButton: boolean = true;
    currentPage = this.constant.numbers.one;
    perPageData = this.constant.numbers.five;
    SlidePerPage = this.constant.numbers.two;
    badgeslide = this.constant.numbers.three;

    ngOnInit() {
        let self = this;
        this.storage.get('currentUser').then((user: any) => {
            if (user) {
                self.currentUser = user;
                this.getNotification();
                this.userCertificates();
            }
        });
    }

    //Certificate slide change 
    onSlideCertChanged() {
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

    //Get unread notification count
    getNotification() {
        let userId = this.currentUser.userId;
        let socketObj = {
            userId: userId
        };
        this.socketService.getNotification(socketObj).subscribe((data) => {
            this.notificationCount = data['unReadCount'];
        });
    }

    //Infinite scroll event call
    doInfinite(event) {
        this.currentPage += 1;
        this.scrollEnable = true;
        setTimeout(() => {
            this.userCertificates();
            event.complete(); //To complete scrolling event.
        }, 1000);
    }

    //to get badge list
    userCertificates() {
        this.http.get(API_URL.URLS.certificates + '?userId=' + this.currentUser.userId + '&page=' + this.currentPage + '&size=' + this.perPageData).subscribe((res) => {
            if (res['isSuccess']) {
                let totalData = res['data']['count'];
                this.totalPage = totalData / this.perPageData;
                if (this.scrollEnable) {
                    for (let i = 0; i < res['data']['rows'].length; i++) {
                        this.certificateList.push(res['data']['rows'][i]);
                    }
                } else {
                    this.certificateList = res['data']['rows'];
                }
            }
        })
    }

    //Redirect to notification page
    goToNotification() {
        this.navCtrl.setRoot('notification-page');
    }

    //Redirect to Forum page
    goToForum() {
        this.navCtrl.setRoot('forum-page');
    }


}
