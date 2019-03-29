import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService  } from '../../services/util.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SideBarComponent implements OnInit {

  constructor(public router: Router, private utilservice: UtilService) { }
   
   role;
   peerAdmin;
   networkAdmin;

  ngOnInit() {
       let role = this.utilservice.getRole();
       if(role == 1){
         this.networkAdmin = true;
         this.peerAdmin = false;
       }else{
         this.peerAdmin = true;
         this.networkAdmin =  false;
       }
  }

}
