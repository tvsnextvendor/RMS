import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard.component'
import {HttpService} from '../../services/http.service';
import {ModuleDropdownComponent} from './module-dropdown';
import { Header } from '../../Constants/header';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  title:string = '';
  moduleType: null;
  moduleList;
  hideModule = false;
  splitUrl;
  headerData: Header = {} as any;
  filtersLoaded: Promise<boolean>;
 

  constructor(private headerService: HeaderService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { 
    const currentUrl = this.router.url;
    this.splitUrl = currentUrl.split('/');
    
  }
   
  ngOnInit(){
    this.headerService.TitleDetail.subscribe((resp) => { 
      setTimeout(() =>{ this.title=resp.title,
                        this.hideModule=resp.hidemodule })
    });
  }

  logOut(){
    localStorage.removeItem("userData");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

}
