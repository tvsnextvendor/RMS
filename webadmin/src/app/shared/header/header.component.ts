import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard.component'
import {HttpService,CommonService} from '../../services';
import {ModuleDropdownComponent} from './module-dropdown';
import { Header } from '../../Constants/header';
import { HeaderVar } from 'src/app/Constants/header.var';
import { API_URL } from '../../Constants/api_url';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  headerData: Header = {} as any;
  filtersLoaded: Promise<boolean>;

  constructor(private commonService:CommonService,public headerVar: HeaderVar,private headerService: HeaderService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { 
    const currentUrl = this.router.url;
    this.headerVar.splitUrl = currentUrl.split('/');
    this.headerVar.url = API_URL.URLS;
  }
   
  ngOnInit(){
    this.headerService.TitleDetail.subscribe((resp) => { 
      setTimeout(() =>{ this.headerVar.title=resp.title,
                        this.headerVar.hideModule=resp.hidemodule })
    });

    this.http.get(this.headerVar.url.getNotifications).subscribe((data) => {
       this.headerVar.notificationList = data;
    })
  }

  logOut(){
    localStorage.removeItem("userData");
    localStorage.removeItem("user");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

}
