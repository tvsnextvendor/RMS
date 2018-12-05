import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

import { Router,ActivatedRoute } from '@angular/router';

import {AuthGuard} from '../../guard/auth.guard.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  title = '';

  constructor(private headerService: HeaderService,public router:Router,public authGuard:AuthGuard) { }
 
  ngOnInit() {
    this.headerService.title.subscribe(title => {
      this.title = title;
    });
  }

  logOut(){
    localStorage.clear();
    this.authGuard.showSidebar  = false;
    this.authGuard.showHeader = false;
    this.router.navigateByUrl('/login');
  }

}
