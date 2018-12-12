import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard.component'
import {HttpService} from '../../services/http.service';
import {ModuleDropdownComponent} from './module-dropdown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  title:string = '';
  moduleType: null;
  moduleList;
  hideModule=0;
  splitUrl;
 

  constructor(private headerService: HeaderService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { 
    const currentUrl = this.router.url;
    this.splitUrl = currentUrl.split('/');
    
  }
   
  ngOnInit(){
    this.headerService.title.subscribe((resp) => { 
      setTimeout(() =>{ this.title=resp.title,
                        this.hideModule=resp.hidemodule }, 0)
    });
  }

  logOut(){
    localStorage.removeItem("userData");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

}
