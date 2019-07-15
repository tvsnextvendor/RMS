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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  headerData: Header = {} as any;
  filtersLoaded: Promise<boolean>;
  breadCrumbData;

  constructor(public commonService:CommonService,public socketService: SocketService,public utilService: UtilService,public headerVar: HeaderVar,private headerService: HeaderService,private breadCrumbService : BreadCrumbService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { 
    const currentUrl = this.router.url;
    this.headerVar.splitUrl = currentUrl.split('/');
    this.headerVar.url = API_URL.URLS;
  }
   
  ngOnInit(){
   // this.getNotification();
    this.headerService.TitleDetail.subscribe((resp) => { 
      setTimeout(() =>{ this.headerVar.title=resp.title,
          this.headerVar.hideModule=resp.hidemodule 
        })
    });
    
    this.http.get(this.headerVar.url.getNotifications).subscribe((data) => {
       this.headerVar.notificationList = data;
    })
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
    //console.log(userData.userId)
      let socketObj = {
        userId : userData.userId
      };
      setInterval(() => {
         this.socketService.getNotification(socketObj).subscribe((data) => {
             //console.log(data)
             //this.notificationCount = data['unReadCount'];
         });
      }, 10000);
     
   }

}
