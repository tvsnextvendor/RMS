import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard.component'
import {HttpService,CommonService,BreadCrumbService, UtilService} from '../../services';
import {ModuleDropdownComponent} from './module-dropdown';
import { Header } from '../../Constants/header';
import { HeaderVar } from 'src/app/Constants/header.var';
import {SocketService} from '../socket.service';
import { API_URL } from '../../Constants/api_url';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  headerData: Header = {} as any;
  filtersLoaded: Promise<boolean>;
  breadCrumbData;
  uploadPath;
  notificationList;
  notificationCount;

  constructor(public commonService:CommonService,public socketService: SocketService,public utilService: UtilService,public headerVar: HeaderVar,private headerService: HeaderService,private breadCrumbService : BreadCrumbService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { 
    const currentUrl = this.router.url;
    this.headerVar.splitUrl = currentUrl.split('/');
    this.headerVar.url = API_URL.URLS;
  }
   
  ngOnInit(){
    let userData= this.utilService.getUserData();
    console.log(userData, "USERDATA");
    this.uploadPath = userData ? userData.uploadPaths.uploadPath : '';
    this.getNotification();
    this.headerService.TitleDetail.subscribe((resp) => { 
      setTimeout(() =>{ this.headerVar.title=resp.title,
          this.headerVar.hideModule=resp.hidemodule 
        })
    });
  }

  ngDoCheck(){
    this.breadCrumbData = [];
    this.breadCrumbData = this.breadCrumbService.title && this.breadCrumbService.title;
  }

  logOut(){
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

  getNotification(){
      let userData = this.utilService.getUserData();
      let socketObj = {
        userId : userData.userId
      };
      this.socketService.getNotification(socketObj).subscribe((data) => {
          this.notificationCount = data['unReadCount'];
          this.notificationList = data['rows'];
      });
       setInterval(() => {
         this.socketService.getNotification(socketObj).subscribe((data) => {
             this.notificationCount = data['unReadCount'];
             this.notificationList = data['rows'];
             console.log(this.notificationList)

         });
       }, 15000);  
   }

   calculateHours(date){
    var a = moment(new Date(date));
    var b = moment(new Date());
    let day =  a.from(b, true) // "2 days ago"
    var temp = day.split(" ")//now you have 3 words in temp
    if(temp[0] == 'a' || temp[0] == 'an'){
      temp[0] = '1';
    }
    return temp[0] + temp[1].charAt(0); // return as 2d
  }

}
