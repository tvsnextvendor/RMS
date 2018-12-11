import { Component, OnInit} from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { Router,ActivatedRoute } from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard.component'
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  title = '';
  moduleType: null;
  moduleList;
 

  constructor(private headerService: HeaderService,private http: HttpService,public router:Router,public authGuard:AuthGuard) { }
 


  ngOnInit(){
    this.headerService.title.subscribe(title => {
      setTimeout(() => this.title = title, 0)
    });
  }

 onChangeModule(){
 }

  logOut(){
    localStorage.removeItem("userData");
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

}
